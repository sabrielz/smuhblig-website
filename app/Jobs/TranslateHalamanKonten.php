<?php

namespace App\Jobs;

use App\Models\AiJob;
use App\Models\HalamanKonten;
use App\Models\HalamanKontenTranslation;
use App\Services\AiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Menerjemahkan semua konten halaman dari locale 'id' ke 'en' via AI.
 * Hanya menerjemahkan konten yang belum di-review manual (reviewed = false).
 */
class TranslateHalamanKonten implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 3;
    public int $timeout = 300;
    public array $backoff = [15, 60, 120];

    public function __construct(
        protected AiJob $aiJob,
        protected string $halaman,
    ) {
        $this->queue = 'ai';
    }

    public function handle(AiService $aiService): void
    {
        $startTime = hrtime(true);

        $this->aiJob->update(['status' => 'processing']);

        Log::info('[TranslateHalamanKonten] Starting', [
            'ai_job_id' => $this->aiJob->id,
            'halaman'   => $this->halaman,
        ]);

        try {
            // Ambil semua konten halaman dengan eager load translations
            $kontenItems = HalamanKonten::where('halaman', $this->halaman)
                ->with('translations')
                ->orderBy('section')
                ->orderBy('sort_order')
                ->get();

            $translatedCount = 0;
            $skippedCount    = 0;

            foreach ($kontenItems as $konten) {
                // Ambil nilai bahasa Indonesia
                $translationId = $konten->translations->firstWhere('locale', 'id');
                if (!$translationId || empty($translationId->value)) {
                    $skippedCount++;
                    continue;
                }

                // Cek apakah terjemahan EN sudah ada dan sudah direview manual
                $translationEn = $konten->translations->firstWhere('locale', 'en');
                if ($translationEn && $translationEn->reviewed === true) {
                    $skippedCount++;
                    continue; // Jangan timpa yang sudah direview
                }

                // Skip tipe boolean, number, url, image — tidak perlu diterjemahkan
                if (in_array($konten->type, ['boolean', 'number', 'image', 'url'], true)) {
                    $skippedCount++;
                    continue;
                }

                // Terjemahkan via AI
                try {
                    $translatedValue = $this->translateValue(
                        $aiService,
                        $translationId->value,
                        $konten->type,
                        $konten->label ?? $konten->key,
                    );

                    // Simpan atau update translation EN
                    HalamanKontenTranslation::updateOrCreate(
                        [
                            'halaman_konten_id' => $konten->id,
                            'locale'            => 'en',
                        ],
                        [
                            'value'        => $translatedValue,
                            'ai_translated' => true,
                            'reviewed'     => false,
                        ]
                    );

                    $translatedCount++;
                } catch (Throwable $e) {
                    Log::warning('[TranslateHalamanKonten] Failed to translate individual item', [
                        'konten_id' => $konten->id,
                        'key'       => $konten->key,
                        'error'     => $e->getMessage(),
                    ]);
                    // Lanjut ke item berikutnya, jangan stop semua
                }
            }

            $durationMs = (int) ((hrtime(true) - $startTime) / 1_000_000);

            $summary = json_encode([
                'translated' => $translatedCount,
                'skipped'    => $skippedCount,
                'halaman'    => $this->halaman,
            ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);

            $this->aiJob->update([
                'status'      => 'done',
                'output'      => $summary,
                'duration_ms' => $durationMs,
            ]);

            Log::info('[TranslateHalamanKonten] Completed', [
                'ai_job_id'   => $this->aiJob->id,
                'translated'  => $translatedCount,
                'skipped'     => $skippedCount,
                'duration_ms' => $durationMs,
            ]);
        } catch (Throwable $e) {
            $durationMs = (int) ((hrtime(true) - $startTime) / 1_000_000);

            $this->aiJob->update([
                'status'        => 'failed',
                'error_message' => mb_substr($e->getMessage(), 0, 2000),
                'duration_ms'   => $durationMs,
            ]);

            Log::error('[TranslateHalamanKonten] Failed', [
                'ai_job_id' => $this->aiJob->id,
                'error'     => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Terjemahkan satu nilai konten ke Bahasa Inggris.
     */
    private function translateValue(
        AiService $aiService,
        string $value,
        string $type,
        string $label
    ): string {
        $isHtml = in_array($type, ['richtext'], true);

        $systemPrompt = 'You are a professional Indonesian-English translator specializing in educational institution content for an Islamic vocational high school (SMK) in Indonesia. Translate naturally and maintain the original tone and style.';

        if ($isHtml) {
            $userPrompt = <<<PROMPT
Translate the following HTML content from Indonesian to English.
Preserve all HTML tags exactly as they are. Only translate the text content.
Field: {$label}

Content:
{$value}

Return ONLY the translated HTML, no explanations, no markdown code blocks.
PROMPT;
        } else {
            $userPrompt = <<<PROMPT
Translate the following text from Indonesian to English.
Field: {$label}

Text: {$value}

Return ONLY the translated text, no explanations, no quotes.
PROMPT;
        }

        return $aiService->callAnthropicApi($userPrompt, $systemPrompt, 1024);
    }

    public function failed(Throwable $exception): void
    {
        $this->aiJob->update([
            'status'        => 'failed',
            'error_message' => mb_substr($exception->getMessage(), 0, 2000),
        ]);

        Log::error('[TranslateHalamanKonten] Permanently failed', [
            'ai_job_id' => $this->aiJob->id,
            'error'     => $exception->getMessage(),
        ]);
    }
}

<?php

namespace App\Jobs;

use App\Models\AiJob;
use App\Models\Article;
use App\Models\ArticleTranslation;
use App\Services\AiService;
use App\Services\HtmlSanitizer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class TranslateArticle implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 3;

    public int $timeout = 120;

    /**
     * @var int[]
     */
    public array $backoff = [10, 30, 60];

    public function __construct(
        protected Article $article,
    ) {
        $this->queue = 'ai';
    }

    public function handle(AiService $aiService): void
    {
        /** @var ArticleTranslation|null $idTranslation */
        $idTranslation = $this->article->translations()->where('locale', 'id')->first();
        if (! $idTranslation) {
            Log::warning('[TranslateArticle] Translation ID not found for article: '.$this->article->id);

            return;
        }

        // Jika terjemahan EN sudah ada, jangan timpa
        $enExists = $this->article->translations()->where('locale', 'en')->exists();
        if ($enExists) {
            return;
        }

        $inputPayload = [
            'article_id' => $this->article->id,
            'title' => $idTranslation->title,
            'excerpt' => $idTranslation->excerpt,
            'content' => $idTranslation->content,
            'target_locale' => 'en',
        ];

        /** @var AiJob $aiJob */
        $aiJob = AiJob::create([
            'user_id' => $this->article->user_id,
            'job_type' => 'translate',
            'input' => json_encode($inputPayload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
            'status' => 'processing',
        ]);

        $startTime = hrtime(true);

        try {
            $translated = $aiService->translateContent([
                'title' => $idTranslation->title,
                'excerpt' => $idTranslation->excerpt,
                'content' => $idTranslation->content,
            ], 'en');

            $cleanContent = HtmlSanitizer::clean($translated['content']);

            ArticleTranslation::create([
                'article_id' => $this->article->id,
                'locale' => 'en',
                'title' => $translated['title'],
                'excerpt' => $translated['excerpt'],
                'content' => $cleanContent,
                'ai_translated' => true,
                'reviewed' => false,
            ]);

            $durationMs = (int) ((hrtime(true) - $startTime) / 1_000_000);

            $aiJob->update([
                'status' => 'done',
                'output' => json_encode($translated, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
                'duration_ms' => $durationMs,
            ]);

            Log::info('[TranslateArticle] Completed auto translation', [
                'article_id' => $this->article->id,
                'ai_job_id' => $aiJob->id,
                'duration_ms' => $durationMs,
            ]);
        } catch (Throwable $e) {
            $durationMs = (int) ((hrtime(true) - $startTime) / 1_000_000);

            $aiJob->update([
                'status' => 'failed',
                'error_message' => mb_substr($e->getMessage(), 0, 2000),
                'duration_ms' => $durationMs,
            ]);

            Log::error('[TranslateArticle] Failed auto translation', [
                'article_id' => $this->article->id,
                'ai_job_id' => $aiJob->id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}

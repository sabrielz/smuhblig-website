<?php

namespace App\Services;

use App\Exceptions\AiServiceException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Central service for all Anthropic Claude AI interactions.
 *
 * Every public method maps 1-to-1 with a job_type stored in the
 * `ai_jobs` table. All calls are logged and throw
 * {@see AiServiceException} on failure.
 */
class AiService
{
    protected string $apiKey;
    protected string $model;
    protected string $apiUrl;
    protected string $apiVersion;
    protected int $defaultMaxTokens;

    public function __construct()
    {
        $this->apiKey          = config('ai.anthropic.api_key', '');
        $this->model           = config('ai.anthropic.model', 'claude-sonnet-4-20250514');
        $this->apiUrl          = config('ai.anthropic.api_url', 'https://api.anthropic.com/v1/messages');
        $this->apiVersion      = config('ai.anthropic.version', '2023-06-01');
        $this->defaultMaxTokens = config('ai.max_tokens', 4096);
    }

    /* ------------------------------------------------------------------ *
     |  Core API call
     * ------------------------------------------------------------------ */

    /**
     * Send a prompt to the Anthropic Messages API and return the text response.
     *
     * @throws AiServiceException
     */
    public function callAnthropicApi(
        string $userPrompt,
        string $systemPrompt,
        int $maxTokens = 0,
    ): string {
        $maxTokens = $maxTokens > 0 ? $maxTokens : $this->defaultMaxTokens;

        Log::info('[AiService] Calling Anthropic API', [
            'model'      => $this->model,
            'max_tokens' => $maxTokens,
            'prompt_len' => mb_strlen($userPrompt),
        ]);

        try {
            $response = Http::withHeaders([
                'x-api-key'         => $this->apiKey,
                'anthropic-version' => $this->apiVersion,
                'content-type'      => 'application/json',
            ])
            ->timeout(120)
            ->post($this->apiUrl, [
                'model'      => $this->model,
                'max_tokens' => $maxTokens,
                'system'     => $systemPrompt,
                'messages'   => [
                    [
                        'role'    => 'user',
                        'content' => $userPrompt,
                    ],
                ],
            ]);
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('[AiService] Network error', ['error' => $e->getMessage()]);
            throw AiServiceException::networkError($e);
        }

        if ($response->failed()) {
            $body = $response->body();
            Log::error('[AiService] API returned error', [
                'status' => $response->status(),
                'body'   => mb_substr($body, 0, 500),
            ]);
            throw AiServiceException::apiError(
                $response->json('error.message', 'Unknown error'),
                $response->status(),
                $body,
            );
        }

        $text = $response->json('content.0.text', '');

        if ($text === '' || $text === null) {
            Log::warning('[AiService] Empty response from API', [
                'body' => mb_substr($response->body(), 0, 500),
            ]);
            throw new AiServiceException('Anthropic API returned an empty response.');
        }

        Log::info('[AiService] API call succeeded', [
            'response_len' => mb_strlen($text),
            'usage'        => $response->json('usage'),
        ]);

        return $text;
    }

    /* ------------------------------------------------------------------ *
     |  JSON helper
     * ------------------------------------------------------------------ */

    /**
     * Parse a JSON string that may be wrapped in markdown code fences.
     *
     * @throws AiServiceException
     * @return array<string, mixed>
     */
    public function parseJsonResponse(string $response): array
    {
        // Strip markdown code fences (```json ... ``` or ``` ... ```)
        $cleaned = preg_replace('/^```(?:json)?\s*/i', '', trim($response));
        $cleaned = preg_replace('/\s*```\s*$/', '', $cleaned);

        try {
            /** @var array<string, mixed> $decoded */
            $decoded = json_decode((string) $cleaned, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException $e) {
            Log::error('[AiService] Failed to parse JSON response', [
                'raw' => mb_substr($response, 0, 500),
            ]);
            throw AiServiceException::invalidJson($response, $e);
        }

        return $decoded;
    }

    /* ------------------------------------------------------------------ *
     |  Feature methods (mapped from job_type)
     * ------------------------------------------------------------------ */

    /**
     * Generate a full article draft.
     *
     * @param array{judul: string, poin?: string|null, nada?: string, locale?: string} $params
     */
    public function generateArticle(array $params): string
    {
        $judul  = $params['judul'];
        $poin   = $params['poin'] ?? '';
        $nada   = $params['nada'] ?? 'Semi-formal';
        $locale = $params['locale'] ?? 'Indonesia';

        $systemPrompt = 'Kamu adalah asisten penulis konten profesional untuk website sekolah SMK Muhammadiyah Bligo, sebuah Sekolah Menengah Kejuruan Islam di Indonesia. Tulis konten yang informatif, engaging, dan sesuai dengan nilai-nilai Islam dan pendidikan.';

        $userPrompt = <<<PROMPT
Tulis artikel berita/blog lengkap dalam bahasa {$locale} dengan:
- Judul: {$judul}
- Poin-poin utama: {$poin}
- Nada: {$nada}

Struktur artikel:
1. Lead paragraph yang menarik (2-3 kalimat)
2. Isi utama (3-5 paragraf)
3. Penutup/kesimpulan (1-2 kalimat)

Format output dalam HTML yang kompatibel dengan TipTap editor:
- Gunakan <p> untuk paragraf
- Gunakan <h2> untuk sub-judul jika diperlukan
- Gunakan <ul><li> untuk daftar
- JANGAN gunakan tag lain selain di atas
- Jangan sertakan tag <html>, <body>, atau <head>
PROMPT;

        return $this->callAnthropicApi($userPrompt, $systemPrompt);
    }

    /**
     * Revise selected text based on an instruction.
     */
    public function reviseText(string $text, string $instruction): string
    {
        $systemPrompt = 'Kamu adalah editor profesional. Revisi teks berikut sesuai instruksi. Pertahankan fakta dan informasi, hanya perbaiki gaya dan kualitas tulisan. Kembalikan HANYA teks yang telah direvisi, tanpa penjelasan tambahan.';

        $userPrompt = <<<PROMPT
Teks asli:
"{$text}"

Instruksi: {$instruction}

Kembalikan teks yang sudah direvisi dalam bahasa yang sama dengan teks asli.
PROMPT;

        return $this->callAnthropicApi($userPrompt, $systemPrompt);
    }

    /**
     * Grammar & style correction on full HTML content.
     */
    public function correctGrammar(string $htmlContent): string
    {
        $systemPrompt = 'Kamu adalah proofreader profesional untuk konten bahasa Indonesia dan Inggris.';

        $userPrompt = <<<PROMPT
Periksa dan koreksi teks berikut. Perbaiki:
1. Kesalahan grammar dan ejaan
2. Tanda baca yang salah
3. Inkonsistensi penulisan (kapital, format)
4. Kalimat yang terlalu panjang atau membingungkan

Kembalikan teks yang sudah dikoreksi dalam format HTML yang sama dengan input. Jika tidak ada kesalahan signifikan, kembalikan teks asli.

Teks:
{$htmlContent}
PROMPT;

        return $this->callAnthropicApi($userPrompt, $systemPrompt);
    }

    /**
     * Translate content to a target locale.
     *
     * @param  array{title: string, excerpt?: string|null, content: string} $content
     * @return array{title: string, excerpt: string, content: string}
     */
    public function translateContent(array $content, string $targetLocale): array
    {
        $title   = $content['title'];
        $excerpt = $content['excerpt'] ?? '';
        $html    = $content['content'];

        $sourceLang = ($targetLocale === 'en') ? 'Bahasa Indonesia' : 'Bahasa Inggris';
        $targetLang = ($targetLocale === 'en') ? 'Bahasa Inggris'   : 'Bahasa Indonesia';

        $systemPrompt = "Kamu adalah penerjemah profesional {$sourceLang}-{$targetLang} yang berspesialisasi dalam konten pendidikan dan institusi. Terjemahkan dengan natural, tidak kaku, dan pertahankan nuansa dan tone dari teks asli.";

        $userPrompt = <<<PROMPT
Terjemahkan konten berikut dari {$sourceLang} ke {$targetLang}.

Judul: {$title}
Excerpt: {$excerpt}
Konten: {$html}

Format output sebagai JSON:
{
  "title": "terjemahan judul",
  "excerpt": "terjemahan excerpt (maks 160 karakter)",
  "content": "terjemahan konten dalam HTML yang sama strukturnya dengan input"
}

Kembalikan HANYA JSON, tanpa markdown code block, tanpa teks penjelasan.
PROMPT;

        $raw = $this->callAnthropicApi($userPrompt, $systemPrompt);

        return $this->parseJsonResponse($raw);
    }

    /**
     * Run SEO analysis on article data.
     *
     * @param  array{title: string, content: string, meta_description?: string|null} $articleData
     * @return array{skor: int, meta_description_saran: string, kata_kunci_utama: string[], saran: array<int, array{tipe: string, pesan: string}>, keterbacaan: string, estimasi_baca: string}
     */
    public function analyzeSeo(array $articleData): array
    {
        $title           = $articleData['title'];
        $contentPlain    = strip_tags($articleData['content']);
        $metaDescription = $articleData['meta_description'] ?? '';

        $systemPrompt = 'Kamu adalah SEO specialist. Analisis konten dan berikan saran yang actionable dan spesifik.';

        $userPrompt = <<<PROMPT
Analisis artikel berikut dan berikan saran SEO.

Judul: {$title}
Konten (plain text): {$contentPlain}
Meta description saat ini: {$metaDescription}

Kembalikan sebagai JSON:
{
  "skor": 75,
  "meta_description_saran": "saran meta description (maks 155 karakter)",
  "kata_kunci_utama": ["kata1", "kata2", "kata3"],
  "saran": [
    {"tipe": "warning", "pesan": "..."},
    {"tipe": "success", "pesan": "..."},
    {"tipe": "info", "pesan": "..."}
  ],
  "keterbacaan": "Baik / Cukup / Perlu Perbaikan",
  "estimasi_baca": "X menit"
}

Kembalikan HANYA JSON.
PROMPT;

        $raw = $this->callAnthropicApi($userPrompt, $systemPrompt);

        return $this->parseJsonResponse($raw);
    }
}

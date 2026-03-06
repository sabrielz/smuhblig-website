<?php

namespace App\Jobs;

use App\Exceptions\AiServiceException;
use App\Models\AiJob;
use App\Services\AiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Single job class that handles every AI job type.
 *
 * The `job_type` column on the {@see AiJob} record determines
 * which {@see AiService} method is invoked.
 */
class ProcessAiJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Maximum number of attempts.
     */
    public int $tries = 3;

    /**
     * Maximum seconds the job may run before timing out.
     */
    public int $timeout = 120;

    /**
     * Backoff intervals in seconds between retries.
     *
     * @var int[]
     */
    public array $backoff = [10, 30, 60];

    public function __construct(
        protected AiJob $aiJob,
    ) {
        $this->queue = 'ai';
    }

    /**
     * Execute the job.
     */
    public function handle(AiService $aiService): void
    {
        $startTime = hrtime(true);

        // Mark as processing
        $this->aiJob->update(['status' => 'processing']);

        Log::info('[ProcessAiJob] Starting', [
            'ai_job_id' => $this->aiJob->id,
            'job_type'  => $this->aiJob->job_type,
        ]);

        try {
            /** @var array<string, mixed> $input */
            $input = json_decode($this->aiJob->input ?? '{}', true, 512, JSON_THROW_ON_ERROR);

            $output = match ($this->aiJob->job_type) {
                'generate'  => $aiService->generateArticle($input),
                'revise'    => $aiService->reviseText(
                    $input['text'] ?? '',
                    $input['instruction'] ?? '',
                ),
                'correct'   => $aiService->correctGrammar($input['html_content'] ?? ''),
                'translate' => json_encode(
                    $aiService->translateContent(
                        [
                            'title'   => $input['title'] ?? '',
                            'excerpt' => $input['excerpt'] ?? '',
                            'content' => $input['content'] ?? '',
                        ],
                        $input['target_locale'] ?? 'en',
                    ),
                    JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE,
                ),
                'seo'       => json_encode(
                    $aiService->analyzeSeo([
                        'title'            => $input['title'] ?? '',
                        'content'          => $input['content'] ?? '',
                        'meta_description' => $input['meta_description'] ?? '',
                    ]),
                    JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE,
                ),
                default     => throw new AiServiceException("Unknown job type: {$this->aiJob->job_type}"),
            };

            $durationMs = (int) ((hrtime(true) - $startTime) / 1_000_000);

            $this->aiJob->update([
                'status'      => 'done',
                'output'      => $output,
                'duration_ms' => $durationMs,
            ]);

            Log::info('[ProcessAiJob] Completed', [
                'ai_job_id'   => $this->aiJob->id,
                'duration_ms' => $durationMs,
            ]);
        } catch (Throwable $e) {
            $durationMs = (int) ((hrtime(true) - $startTime) / 1_000_000);

            $this->aiJob->update([
                'status'        => 'failed',
                'error_message' => mb_substr($e->getMessage(), 0, 2000),
                'duration_ms'   => $durationMs,
            ]);

            Log::error('[ProcessAiJob] Failed', [
                'ai_job_id' => $this->aiJob->id,
                'error'     => $e->getMessage(),
            ]);

            throw $e; // let the queue retry mechanism kick in
        }
    }

    /**
     * Handle a job failure (after all retries exhausted).
     */
    public function failed(Throwable $exception): void
    {
        $this->aiJob->update([
            'status'        => 'failed',
            'error_message' => mb_substr($exception->getMessage(), 0, 2000),
        ]);

        Log::error('[ProcessAiJob] Permanently failed', [
            'ai_job_id' => $this->aiJob->id,
            'error'     => $exception->getMessage(),
        ]);
    }
}

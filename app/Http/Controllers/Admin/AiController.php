<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Ai\AnalyzeSeoRequest;
use App\Http\Requests\Admin\Ai\CorrectRequest;
use App\Http\Requests\Admin\Ai\GenerateRequest;
use App\Http\Requests\Admin\Ai\ReviseRequest;
use App\Http\Requests\Admin\Ai\TranslateRequest;
use App\Jobs\ProcessAiJob;
use App\Models\AiJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

/**
 * Handles all AI-related CMS actions.
 *
 * Every endpoint creates an `ai_jobs` record, dispatches
 * {@see ProcessAiJob} to the "ai" queue, and immediately returns
 * the job ID so the frontend can poll for the result.
 */
class AiController extends Controller
{
    /* ------------------------------------------------------------------ *
     |  Generate Draft Article
     * ------------------------------------------------------------------ */

    public function generate(GenerateRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $aiJob = $this->createAndDispatch('generate', $validated);

        return response()->json([
            'jobId'  => $aiJob->id,
            'status' => 'pending',
        ], 202);
    }

    /* ------------------------------------------------------------------ *
     |  Revise Selected Text
     * ------------------------------------------------------------------ */

    public function revise(ReviseRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $aiJob = $this->createAndDispatch('revise', $validated);

        return response()->json([
            'jobId'  => $aiJob->id,
            'status' => 'pending',
        ], 202);
    }

    /* ------------------------------------------------------------------ *
     |  Grammar & Style Correction
     * ------------------------------------------------------------------ */

    public function correct(CorrectRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $aiJob = $this->createAndDispatch('correct', $validated);

        return response()->json([
            'jobId'  => $aiJob->id,
            'status' => 'pending',
        ], 202);
    }

    /* ------------------------------------------------------------------ *
     |  Translate Content
     * ------------------------------------------------------------------ */

    public function translate(TranslateRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $aiJob = $this->createAndDispatch('translate', $validated);

        return response()->json([
            'jobId'  => $aiJob->id,
            'status' => 'pending',
        ], 202);
    }

    /* ------------------------------------------------------------------ *
     |  SEO Analysis
     * ------------------------------------------------------------------ */

    public function analyzeSeo(AnalyzeSeoRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $aiJob = $this->createAndDispatch('seo', $validated);

        return response()->json([
            'jobId'  => $aiJob->id,
            'status' => 'pending',
        ], 202);
    }

    /* ------------------------------------------------------------------ *
     |  Job Status Polling
     * ------------------------------------------------------------------ */

    public function jobStatus(AiJob $aiJob): JsonResponse
    {
        // Only the owner may check the status of their own job.
        if ($aiJob->user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses ke job ini.');
        }

        return response()->json([
            'id'            => $aiJob->id,
            'status'        => $aiJob->status,
            'output'        => $aiJob->output,
            'error_message' => $aiJob->error_message,
            'job_type'      => $aiJob->job_type,
        ]);
    }

    /* ------------------------------------------------------------------ *
     |  Private helper
     * ------------------------------------------------------------------ */

    /**
     * Create an ai_jobs record and dispatch the queue job.
     *
     * @param  string               $jobType
     * @param  array<string, mixed> $input
     */
    private function createAndDispatch(string $jobType, array $input): AiJob
    {
        $aiJob = AiJob::create([
            'user_id'  => Auth::id(),
            'job_type' => $jobType,
            'input'    => json_encode($input, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
            'status'   => 'pending',
        ]);

        ProcessAiJob::dispatch($aiJob)->onQueue('ai');

        return $aiJob;
    }
}

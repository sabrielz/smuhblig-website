<?php

namespace App\Observers;

use App\Models\AiJob;
use Illuminate\Support\Facades\Log;

class AiJobObserver
{
    /**
     * Handle the AiJob "updated" event.
     */
    public function updated(AiJob $aiJob): void
    {
        if ($aiJob->isDirty('status') && $aiJob->status === 'failed') {
            Log::channel('ai')->error('AiJob permanently failed or encountered an error', [
                'ai_job_id' => $aiJob->id,
                'user_id' => $aiJob->user_id,
                'job_type' => $aiJob->job_type,
                'error_message' => $aiJob->error_message,
            ]);
        }
    }
}

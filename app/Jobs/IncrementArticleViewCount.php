<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

use App\Models\Article;

class IncrementArticleViewCount implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Article $article)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->article->increment('view_count');
    }
}

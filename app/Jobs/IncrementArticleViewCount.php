<?php

namespace App\Jobs;

use App\Models\Article;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class IncrementArticleViewCount implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Article $article) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->article->increment('view_count');
    }
}

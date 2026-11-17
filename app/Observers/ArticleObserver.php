<?php

namespace App\Observers;

use App\Enums\ArticleStatus;
use App\Jobs\GenerateSitemapJob;
use App\Models\Article;
use App\Services\NotifikasiService;

class ArticleObserver
{
    /**
     * Handle the Article "updated" event.
     * Kirim notifikasi ketika artikel berubah status ke 'pending_review'.
     */
    public function updated(Article $article): void
    {
        if ($article->wasChanged('status')) {
            $oldStatus = $article->getOriginal('status');
            $oldStatusVal = $oldStatus instanceof ArticleStatus ? $oldStatus->value : (string) $oldStatus;
            $newStatusVal = $article->status->value;

            // Dispatch update sitemap jika status melibatkan published
            if ($oldStatusVal === ArticleStatus::Published->value || $newStatusVal === ArticleStatus::Published->value) {
                GenerateSitemapJob::dispatch();
            }
        }

        // Hanya trigger jika status berubah ke pending_review
        if ($article->wasChanged('status') && $article->status === ArticleStatus::PendingReview) {
            $adminAndEditorIds = NotifikasiService::getAdminAndEditorIds();

            if (! empty($adminAndEditorIds)) {
                $title = $article->translation('id')?->title ?? 'Artikel Baru';

                NotifikasiService::kirim(
                    $adminAndEditorIds,
                    'artikel_pending',
                    'Artikel menunggu review: '.$title,
                    null,
                    '/admin/artikel/'.$article->id.'/edit',
                    ['article_id' => $article->id],
                );
            }
        }
    }

    /**
     * Handle the Article "created" event.
     * Bisa digunakan di masa depan untuk notifikasi artikel baru.
     */
    public function created(Article $article): void
    {
        // Reserved for future use
    }
}

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
     */
    public function updated(Article $article): void
    {
        if (! $article->wasChanged('status')) {
            return;
        }

        $oldStatus = $article->getOriginal('status');
        $oldStatusVal = $oldStatus instanceof ArticleStatus ? $oldStatus->value : (string) $oldStatus;
        $newStatusVal = $article->status->value;

        // 1. Dispatch update sitemap jika status melibatkan published
        if ($oldStatusVal === ArticleStatus::Published->value || $newStatusVal === ArticleStatus::Published->value) {
            GenerateSitemapJob::dispatch();
        }

        $title = ($trans = $article->translation('id')) ? $trans->title : 'Artikel';

        // 2. Alur: -> pending_review = Notifikasi ke Admin & Editor
        if ($newStatusVal === ArticleStatus::PendingReview->value) {
            $adminAndEditorIds = NotifikasiService::getAdminAndEditorIds();

            if (! empty($adminAndEditorIds)) {
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

        // 3. Alur: pending_review -> published = Notifikasi ke penulis
        if ($oldStatusVal === ArticleStatus::PendingReview->value && $newStatusVal === ArticleStatus::Published->value) {
            if ($article->user_id) {
                NotifikasiService::kirim(
                    [$article->user_id],
                    'artikel_terbit',
                    'Artikel Anda telah diterbitkan: '.$title,
                    'Selamat! Artikel Anda telah disetujui dan diterbitkan.',
                    '/admin/artikel/'.$article->id.'/edit',
                    ['article_id' => $article->id],
                );
            }
        }
    }

    /**
     * Handle the Article "created" event.
     */
    public function created(Article $article): void
    {
        // Reserved for future use
    }
}

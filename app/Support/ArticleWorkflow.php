<?php

namespace App\Support;

use App\Models\Article;
use App\Models\Pengaturan;
use App\Models\User;

class ArticleWorkflow
{
    /**
     * Get allowed statuses for a user when creating/updating an article.
     *
     * Rules (BR-002):
     * - Editor & Admin: all statuses ('draft', 'pending_review', 'published', 'archived').
     * - Author: 'draft', 'pending_review'.
     *   Plus 'published' only if !Pengaturan::bool('artikel_approval') AND the article belongs to the author (or is a new article).
     *
     * @return list<string>
     */
    public static function allowedStatuses(User $user, ?Article $article = null): array
    {
        if ($user->isAdmin() || $user->isEditor()) {
            return ['draft', 'pending_review', 'published', 'archived'];
        }

        if ($user->isAuthor()) {
            $statuses = ['draft', 'pending_review'];

            $isOwnOrNew = $article === null || (int) $article->user_id === (int) $user->id;
            $approvalDisabled = ! Pengaturan::bool('artikel_approval');

            if ($approvalDisabled && $isOwnOrNew) {
                $statuses[] = 'published';
            }

            return $statuses;
        }

        return ['draft'];
    }
}

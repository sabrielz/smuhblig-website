<?php

namespace App\Support;

use App\Enums\ArticleStatus;
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
            return [
                ArticleStatus::Draft->value,
                ArticleStatus::PendingReview->value,
                ArticleStatus::Published->value,
                ArticleStatus::Archived->value,
            ];
        }

        if ($user->isAuthor()) {
            $statuses = [
                ArticleStatus::Draft->value,
                ArticleStatus::PendingReview->value,
            ];

            $isOwnOrNew = $article === null || (int) $article->user_id === (int) $user->id;
            $approvalDisabled = ! Pengaturan::bool('artikel_approval');

            if ($approvalDisabled && $isOwnOrNew) {
                $statuses[] = ArticleStatus::Published->value;
            }

            return $statuses;
        }

        return [ArticleStatus::Draft->value];
    }
}

<?php

namespace App\Policies;

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\User;
use App\Support\ArticleWorkflow;

class ArticlePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isStaff();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Article $article): bool
    {
        if ($user->isAdmin() || $user->isEditor()) {
            return true;
        }

        return $user->isAuthor() && (int) $article->user_id === (int) $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isStaff();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Article $article): bool
    {
        if ($user->isAdmin() || $user->isEditor()) {
            return true;
        }

        if ($user->isAuthor()) {
            return (int) $article->user_id === (int) $user->id
                && in_array($article->status->value, [ArticleStatus::Draft->value, ArticleStatus::PendingReview->value], true);
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Article $article): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    /**
     * Determine whether the user can publish the model.
     */
    public function publish(User $user, Article $article): bool
    {
        if ($user->isAdmin() || $user->isEditor()) {
            return true;
        }

        if ($user->isAuthor()) {
            return in_array(ArticleStatus::Published->value, ArticleWorkflow::allowedStatuses($user, $article), true);
        }

        return false;
    }

    /**
     * Determine whether the user can mark translations as reviewed.
     */
    public function markTranslationReviewed(User $user, Article $article): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }
}

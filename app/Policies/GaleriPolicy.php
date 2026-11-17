<?php

namespace App\Policies;

use App\Models\Galeri;
use App\Models\User;

class GaleriPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function view(User $user, Galeri $galeri): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function update(User $user, Galeri $galeri): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, Galeri $galeri): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }
}

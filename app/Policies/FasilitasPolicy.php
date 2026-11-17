<?php

namespace App\Policies;

use App\Models\Fasilitas;
use App\Models\User;

class FasilitasPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function view(User $user, Fasilitas $fasilitas): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function update(User $user, Fasilitas $fasilitas): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, Fasilitas $fasilitas): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }
}

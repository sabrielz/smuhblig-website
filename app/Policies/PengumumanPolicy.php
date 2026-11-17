<?php

namespace App\Policies;

use App\Models\Pengumuman;
use App\Models\User;

class PengumumanPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function view(User $user, Pengumuman $pengumuman): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function update(User $user, Pengumuman $pengumuman): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, Pengumuman $pengumuman): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }
}

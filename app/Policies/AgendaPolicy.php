<?php

namespace App\Policies;

use App\Models\Agenda;
use App\Models\User;

class AgendaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function view(User $user, Agenda $agenda): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function update(User $user, Agenda $agenda): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }

    public function delete(User $user, Agenda $agenda): bool
    {
        return $user->isAdmin() || $user->isEditor();
    }
}

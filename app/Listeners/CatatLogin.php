<?php

namespace App\Listeners;

use App\Models\User;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Http\Request;

class CatatLogin
{
    public function __construct(protected Request $request) {}

    /**
     * Handle user login events (Login & Failed).
     */
    public function handle(Login|Failed $event): void
    {
        $ip = $this->request->ip();
        $userAgent = $this->request->userAgent();

        if ($event instanceof Login) {
            /** @var User $user */
            $user = $event->user;

            activity('auth')
                ->causedBy($user)
                ->performedOn($user)
                ->withProperties([
                    'ip' => $ip,
                    'user_agent' => $userAgent,
                    'status' => 'success',
                ])
                ->log("User {$user->email} berhasil login ke sistem.");
        } elseif ($event instanceof Failed) {
            $email = (string) ($event->credentials['email'] ?? 'unknown');
            $user = $event->user;

            $activity = activity('auth')
                ->withProperties([
                    'email' => $email,
                    'ip' => $ip,
                    'user_agent' => $userAgent,
                    'status' => 'failed',
                ]);

            if ($user instanceof User) {
                $activity->performedOn($user);
            }

            $activity->log("Percobaan login gagal untuk email {$email}.");
        }
    }
}

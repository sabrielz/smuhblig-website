<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotifikasiAdmin extends Model
{
    protected $table = 'notifikasi_admin';

    protected $guarded = ['id'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'dibaca_at' => 'datetime',
            'data' => 'array',
        ];
    }

    /**
     * Relation to User (Admin/Editor).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include unread notifications.
     */
    public function scopeBelumDibaca(Builder $query): Builder
    {
        return $query->whereNull('dibaca_at');
    }

    /**
     * Scope a query to only include notifications for a specific user.
     */
    public function scopeUntukUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Mark notification as read.
     */
    public function tandaiBaca(): void
    {
        $this->update(['dibaca_at' => now()]);
    }
}

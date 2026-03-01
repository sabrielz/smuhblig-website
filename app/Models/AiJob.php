<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AiJob extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'job_type',
        'model_type',
        'model_id',
        'input',
        'output',
        'status',
        'error_message',
        'tokens_used',
        'duration_ms',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tokens_used' => 'integer',
            'duration_ms' => 'integer',
        ];
    }

    /**
     * Get the user that owns the AI job.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent model (morphTo).
     */
    public function model(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Scope a query to only include pending jobs.
     */
    public function scopePending(Builder $query): void
    {
        $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include processing jobs.
     */
    public function scopeProcessing(Builder $query): void
    {
        $query->where('status', 'processing');
    }

    /**
     * Scope a query to only include done jobs.
     */
    public function scopeDone(Builder $query): void
    {
        $query->where('status', 'done');
    }

    /**
     * Scope a query to only include failed jobs.
     */
    public function scopeFailed(Builder $query): void
    {
        $query->where('status', 'failed');
    }

    /**
     * Scope a query to only include jobs for a specific user.
     */
    public function scopeForUser(Builder $query, int $userId): void
    {
        $query->where('user_id', $userId);
    }
}

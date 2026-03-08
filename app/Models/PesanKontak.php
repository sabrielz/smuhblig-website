<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use App\Models\User;

class PesanKontak extends Model
{
    use HasFactory;

    protected $table = 'pesan_kontak';

    protected $fillable = [
        'nama',
        'email',
        'nomor_telepon',
        'subjek',
        'pesan',
        'status',
        'ip_address',
        'user_agent',
        'dibaca_at',
        'dibaca_oleh',
    ];

    protected $casts = [
        'dibaca_at' => 'datetime',
    ];

    /**
     * Scope for 'baru' status.
     */
    public function scopeBaru(Builder $query): Builder
    {
        return $query->where('status', 'baru');
    }

    /**
     * Scope for 'dibaca' status.
     */
    public function scopeDibaca(Builder $query): Builder
    {
        return $query->where('status', 'dibaca');
    }

    /**
     * Scope for 'dibalas' status.
     */
    public function scopeDibalas(Builder $query): Builder
    {
        return $query->where('status', 'dibalas');
    }

    /**
     * Mark message as read by specific user.
     */
    public function tandaiBaca(User $user): void
    {
        $this->update([
            'status' => 'dibaca',
            'dibaca_at' => Carbon::now(),
            'dibaca_oleh' => $user->id,
        ]);
    }

    /**
     * User who read the message.
     */
    public function pembaca(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibaca_oleh');
    }
}

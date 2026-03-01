<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PengumumanTranslation extends Model
{
    use HasFactory;

    protected $fillable = [
        'pengumuman_id',
        'locale',
        'judul',
        'konten',
        'ai_translated',
        'reviewed',
    ];

    protected $casts = [
        'ai_translated' => 'boolean',
        'reviewed' => 'boolean',
    ];

    public function pengumuman(): BelongsTo
    {
        return $this->belongsTo(Pengumuman::class);
    }
}

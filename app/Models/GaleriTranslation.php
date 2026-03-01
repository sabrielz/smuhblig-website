<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GaleriTranslation extends Model
{
    use HasFactory;

    protected $fillable = [
        'galeri_id',
        'locale',
        'judul',
        'deskripsi',
        'ai_translated',
        'reviewed',
    ];

    protected $casts = [
        'ai_translated' => 'boolean',
        'reviewed' => 'boolean',
    ];

    public function galeri(): BelongsTo
    {
        return $this->belongsTo(Galeri::class);
    }
}

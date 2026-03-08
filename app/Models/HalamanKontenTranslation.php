<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HalamanKontenTranslation extends Model
{
    protected $fillable = [
        'halaman_konten_id',
        'locale',
        'value',
        'ai_translated',
        'reviewed',
    ];

    public function halamanKonten(): BelongsTo
    {
        return $this->belongsTo(HalamanKonten::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgendaTranslation extends Model
{
    protected $fillable = [
        'agenda_id',
        'locale',
        'judul',
        'deskripsi',
        'lokasi',
        'ai_translated',
        'reviewed',
    ];

    public function agenda(): BelongsTo
    {
        return $this->belongsTo(Agenda::class);
    }
}

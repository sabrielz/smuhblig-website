<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $fasilitas_id
 * @property string $locale
 * @property string $nama
 * @property string|null $deskripsi
 * @property bool $ai_translated
 * @property bool $reviewed
 */
class FasilitasTranslation extends Model
{
    use HasFactory;

    protected $table = 'fasilitas_translations';

    protected $fillable = [
        'fasilitas_id',
        'locale',
        'nama',
        'deskripsi',
        'ai_translated',
        'reviewed',
    ];

    protected $casts = [
        'ai_translated' => 'boolean',
        'reviewed' => 'boolean',
    ];

    public function fasilitas(): BelongsTo
    {
        return $this->belongsTo(Fasilitas::class);
    }
}

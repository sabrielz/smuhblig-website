<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $ekstrakurikuler_id
 * @property string $locale
 * @property string $nama
 * @property string|null $deskripsi
 * @property string|null $jadwal
 * @property bool $ai_translated
 * @property bool $reviewed
 */
class EkstrakurikulerTranslation extends Model
{
    use HasFactory;

    protected $table = 'ekstrakurikuler_translations';

    protected $fillable = [
        'ekstrakurikuler_id',
        'locale',
        'nama',
        'deskripsi',
        'jadwal',
        'ai_translated',
        'reviewed',
    ];

    protected $casts = [
        'ai_translated' => 'boolean',
        'reviewed' => 'boolean',
    ];

    /**
     * @return BelongsTo<Ekstrakurikuler, $this>
     */
    public function ekstrakurikuler(): BelongsTo
    {
        return $this->belongsTo(Ekstrakurikuler::class);
    }
}

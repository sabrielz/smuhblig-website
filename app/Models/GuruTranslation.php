<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $guru_id
 * @property string $locale
 * @property string $jabatan
 * @property string|null $mapel
 * @property bool $ai_translated
 * @property bool $reviewed
 */
class GuruTranslation extends Model
{
    use HasFactory;

    protected $table = 'guru_translations';

    protected $fillable = [
        'guru_id',
        'locale',
        'jabatan',
        'mapel',
        'ai_translated',
        'reviewed',
    ];

    protected $casts = [
        'ai_translated' => 'boolean',
        'reviewed' => 'boolean',
    ];

    public function guru(): BelongsTo
    {
        return $this->belongsTo(Guru::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $prestasi_id
 * @property string $locale
 * @property string $judul
 * @property string|null $ringkasan
 * @property bool $ai_translated
 * @property bool $reviewed
 */
class PrestasiTranslation extends Model
{
    use HasFactory;

    protected $table = 'prestasi_translations';

    protected $fillable = [
        'prestasi_id',
        'locale',
        'judul',
        'ringkasan',
        'ai_translated',
        'reviewed',
    ];

    protected $casts = [
        'ai_translated' => 'boolean',
        'reviewed' => 'boolean',
    ];

    /**
     * @return BelongsTo<Prestasi, $this>
     */
    public function prestasi(): BelongsTo
    {
        return $this->belongsTo(Prestasi::class);
    }
}

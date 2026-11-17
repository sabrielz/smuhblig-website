<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $unduhan_id
 * @property string $locale
 * @property string $judul
 * @property string|null $deskripsi
 * @property bool $ai_translated
 * @property bool $reviewed
 */
class UnduhanTranslation extends Model
{
    use HasFactory;

    protected $table = 'unduhan_translations';

    protected $fillable = [
        'unduhan_id',
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

    /**
     * @return BelongsTo<Unduhan, $this>
     */
    public function unduhan(): BelongsTo
    {
        return $this->belongsTo(Unduhan::class);
    }
}

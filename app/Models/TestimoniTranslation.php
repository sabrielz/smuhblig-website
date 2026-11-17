<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $testimoni_id
 * @property string $locale
 * @property string $kutipan
 * @property bool $ai_translated
 * @property bool $reviewed
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class TestimoniTranslation extends Model
{
    use HasFactory;

    protected $table = 'testimoni_translations';

    protected $fillable = [
        'testimoni_id',
        'locale',
        'kutipan',
        'ai_translated',
        'reviewed',
    ];

    protected $casts = [
        'ai_translated' => 'boolean',
        'reviewed' => 'boolean',
    ];

    /**
     * @return BelongsTo<Testimoni, $this>
     */
    public function testimoni(): BelongsTo
    {
        return $this->belongsTo(Testimoni::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $faq_id
 * @property string $locale
 * @property string $pertanyaan
 * @property string $jawaban
 * @property bool $ai_translated
 * @property bool $reviewed
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class FaqTranslation extends Model
{
    use HasFactory;

    protected $table = 'faq_translations';

    protected $fillable = [
        'faq_id',
        'locale',
        'pertanyaan',
        'jawaban',
        'ai_translated',
        'reviewed',
    ];

    protected $casts = [
        'ai_translated' => 'boolean',
        'reviewed' => 'boolean',
    ];

    /**
     * @return BelongsTo<Faq, $this>
     */
    public function faq(): BelongsTo
    {
        return $this->belongsTo(Faq::class);
    }
}

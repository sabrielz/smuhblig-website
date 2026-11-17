<?php

namespace App\Models;

use App\Traits\LogsActivityTrait;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $kategori
 * @property int $urutan
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Faq extends Model
{
    use HasFactory, LogsActivityTrait;

    protected $table = 'faq';

    protected $fillable = [
        'kategori',
        'urutan',
        'is_active',
    ];

    protected $casts = [
        'urutan' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * @return HasMany<FaqTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(FaqTranslation::class);
    }

    public function translation(?string $locale = null): ?FaqTranslation
    {
        $locale = $locale ?? app()->getLocale();

        return $this->translations->first(function (FaqTranslation $t) use ($locale) {
            return $t->locale === $locale;
        }) ?? $this->translations->first(function (FaqTranslation $t) {
            return $t->locale === 'id';
        });
    }

    /**
     * @param  Builder<Faq>  $query
     * @return Builder<Faq>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<Faq>  $query
     * @return Builder<Faq>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('urutan')->orderBy('id');
    }
}

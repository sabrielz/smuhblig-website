<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Jurusan extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $guarded = ['id'];

    /**
     * Scope a query to only include active jurusans.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to order by sort_order.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order', 'asc');
    }

    /**
     * Get all translations.
     */
    public function translations(): HasMany
    {
        return $this->hasMany(JurusanTranslation::class);
    }

    /**
     * Get translation by locale, fallback to 'id'.
     */
    public function translation(?string $locale = null): ?JurusanTranslation
    {
        $locale = $locale ?: app()->getLocale();

        // Coba cari bahasa yang diminta
        $translation = $this->translations->firstWhere('locale', $locale);

        // Jika tidak ada, fallback ke 'id'
        if (!$translation && $locale !== 'id') {
            $translation = $this->translations->firstWhere('locale', 'id');
        }

        return $translation;
    }

    /**
     * Register Spatie Media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('cover')
            ->singleFile();

        $this->addMediaCollection('gallery');
    }
}

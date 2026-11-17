<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * @property int $id
 * @property string $slug
 * @property string $kategori
 * @property int $urutan
 * @property bool $is_active
 */
class Fasilitas extends Model implements HasMedia
{
    use HasFactory, HasSlug, InteractsWithMedia;

    protected $table = 'fasilitas';

    protected $fillable = [
        'slug',
        'kategori',
        'urutan',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'urutan' => 'integer',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(function ($model) {
                $translation = $model->translations()->where('locale', 'id')->first();
                if ($translation && $translation->nama) {
                    return $translation->nama;
                }

                if (request()->has('nama')) {
                    return request()->input('nama');
                }

                return 'fasilitas-'.uniqid();
            })
            ->saveSlugsTo('slug');
    }

    /**
     * @return HasMany<FasilitasTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(FasilitasTranslation::class);
    }

    public function translation(?string $locale = null): ?FasilitasTranslation
    {
        $locale = $locale ?? app()->getLocale();

        /** @var FasilitasTranslation|null $translation */
        $translation = $this->translations->first(function (FasilitasTranslation $t) use ($locale) {
            return $t->locale === $locale && ($locale === 'id' || $t->reviewed);
        });

        if (! $translation && $locale !== 'id') {
            /** @var FasilitasTranslation|null $translation */
            $translation = $this->translations->first(function (FasilitasTranslation $t) {
                return $t->locale === 'id';
            });
        }

        if (! $translation) {
            /** @var FasilitasTranslation|null $translation */
            $translation = $this->translations->first();
        }

        return $translation;
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('foto');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('webp')
            ->format('webp')
            ->quality(80);

        $this->addMediaConversion('thumb')
            ->width(400)
            ->height(300)
            ->format('webp')
            ->quality(80);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeKategori(Builder $query, string $kategori): Builder
    {
        return $query->where('kategori', $kategori);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('urutan');
    }
}

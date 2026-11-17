<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * @property int $id
 * @property string $slug
 * @property int|null $pembina_guru_id
 * @property int $urutan
 * @property bool $is_active
 * @property-read Guru|null $pembina
 */
class Ekstrakurikuler extends Model implements HasMedia
{
    use HasFactory, HasSlug, InteractsWithMedia;

    protected $table = 'ekstrakurikuler';

    protected $fillable = [
        'slug',
        'pembina_guru_id',
        'urutan',
        'is_active',
    ];

    protected $casts = [
        'pembina_guru_id' => 'integer',
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

                return 'ekskul-'.uniqid();
            })
            ->saveSlugsTo('slug');
    }

    /**
     * @return BelongsTo<Guru, $this>
     */
    public function pembina(): BelongsTo
    {
        return $this->belongsTo(Guru::class, 'pembina_guru_id');
    }

    /**
     * @return HasMany<EkstrakurikulerTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(EkstrakurikulerTranslation::class);
    }

    public function translation(?string $locale = null): ?EkstrakurikulerTranslation
    {
        $locale = $locale ?? app()->getLocale();

        return $this->translations->first(function (EkstrakurikulerTranslation $t) use ($locale) {
            return $t->locale === $locale;
        }) ?? $this->translations->first(function (EkstrakurikulerTranslation $t) {
            return $t->locale === 'id';
        });
    }

    /**
     * @param  Builder<Ekstrakurikuler>  $query
     * @return Builder<Ekstrakurikuler>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<Ekstrakurikuler>  $query
     * @return Builder<Ekstrakurikuler>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('urutan')->orderBy('id');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('foto')
            ->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(400)
            ->height(300)
            ->format('webp')
            ->quality(80);

        $this->addMediaConversion('medium')
            ->width(800)
            ->height(600)
            ->format('webp')
            ->quality(85);
    }
}

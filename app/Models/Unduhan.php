<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * @property int $id
 * @property string $slug
 * @property string $kategori
 * @property Carbon|null $tanggal_terbit
 * @property int $jumlah_unduh
 * @property bool $is_active
 */
class Unduhan extends Model implements HasMedia
{
    use HasFactory, HasSlug, InteractsWithMedia;

    protected $table = 'unduhan';

    protected $fillable = [
        'slug',
        'kategori',
        'tanggal_terbit',
        'jumlah_unduh',
        'is_active',
    ];

    protected $casts = [
        'tanggal_terbit' => 'date',
        'jumlah_unduh' => 'integer',
        'is_active' => 'boolean',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(function ($model) {
                $translation = $model->translations()->where('locale', 'id')->first();
                if ($translation && $translation->judul) {
                    return $translation->judul;
                }

                if (request()->has('judul')) {
                    return request()->input('judul');
                }

                return 'unduhan-'.uniqid();
            })
            ->saveSlugsTo('slug');
    }

    /**
     * @return HasMany<UnduhanTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(UnduhanTranslation::class);
    }

    public function translation(?string $locale = null): ?UnduhanTranslation
    {
        $locale = $locale ?? app()->getLocale();

        return $this->translations->first(function (UnduhanTranslation $t) use ($locale) {
            return $t->locale === $locale;
        }) ?? $this->translations->first(function (UnduhanTranslation $t) {
            return $t->locale === 'id';
        });
    }

    /**
     * @param  Builder<Unduhan>  $query
     * @return Builder<Unduhan>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<Unduhan>  $query
     * @return Builder<Unduhan>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('tanggal_terbit')->orderByDesc('id');
    }

    public function registerMediaCollections(): void
    {
        // Berkas disimpan di disk 'local' (non-publik, tidak bisa diakses lewat /storage/...)
        $this->addMediaCollection('berkas')
            ->useDisk('local')
            ->singleFile();
    }
}

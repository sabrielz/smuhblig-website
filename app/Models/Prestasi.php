<?php

namespace App\Models;

use App\Enums\KategoriPrestasi;
use App\Enums\TingkatPrestasi;
use App\Traits\LogsActivityTrait;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * @property int $id
 * @property string $slug
 * @property TingkatPrestasi $tingkat
 * @property KategoriPrestasi $kategori
 * @property int $tahun
 * @property Carbon|null $tanggal
 * @property int|null $jurusan_id
 * @property bool $is_active
 * @property-read Jurusan|null $jurusan
 */
class Prestasi extends Model implements HasMedia
{
    use HasFactory, HasSlug, InteractsWithMedia, LogsActivityTrait;

    protected $table = 'prestasi';

    protected $fillable = [
        'slug',
        'tingkat',
        'kategori',
        'tahun',
        'tanggal',
        'jurusan_id',
        'is_active',
    ];

    protected $casts = [
        'tingkat' => TingkatPrestasi::class,
        'kategori' => KategoriPrestasi::class,
        'tahun' => 'integer',
        'tanggal' => 'date',
        'jurusan_id' => 'integer',
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

                return 'prestasi-'.uniqid();
            })
            ->saveSlugsTo('slug');
    }

    /**
     * @return BelongsTo<Jurusan, $this>
     */
    public function jurusan(): BelongsTo
    {
        return $this->belongsTo(Jurusan::class);
    }

    /**
     * @return HasMany<PrestasiTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(PrestasiTranslation::class);
    }

    public function translation(?string $locale = null): ?PrestasiTranslation
    {
        $locale = $locale ?? app()->getLocale();

        return $this->translations->first(function (PrestasiTranslation $t) use ($locale) {
            return $t->locale === $locale;
        }) ?? $this->translations->first(function (PrestasiTranslation $t) {
            return $t->locale === 'id';
        });
    }

    /**
     * @param  Builder<Prestasi>  $query
     * @return Builder<Prestasi>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<Prestasi>  $query
     * @return Builder<Prestasi>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('tahun')->orderByDesc('tanggal')->orderByDesc('id');
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
            ->format('webp')
            ->quality(80);

        $this->addMediaConversion('large')
            ->width(1200)
            ->format('webp')
            ->quality(85);
    }
}

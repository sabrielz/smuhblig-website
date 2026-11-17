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

/**
 * @property int $id
 * @property string $nama
 * @property string|null $gelar_depan
 * @property string|null $gelar_belakang
 * @property string $kelompok
 * @property int|null $jurusan_id
 * @property int $urutan
 * @property bool $is_active
 * @property-read string $nama_lengkap
 */
class Guru extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $table = 'guru';

    protected $fillable = [
        'nama',
        'gelar_depan',
        'gelar_belakang',
        'kelompok',
        'jurusan_id',
        'urutan',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'urutan' => 'integer',
        'jurusan_id' => 'integer',
    ];

    protected $appends = [
        'nama_lengkap',
    ];

    public function jurusan(): BelongsTo
    {
        return $this->belongsTo(Jurusan::class);
    }

    /**
     * @return HasMany<GuruTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(GuruTranslation::class);
    }

    public function translation(?string $locale = null): ?GuruTranslation
    {
        $locale = $locale ?? app()->getLocale();

        /** @var GuruTranslation|null $translation */
        $translation = $this->translations->first(function (GuruTranslation $t) use ($locale) {
            return $t->locale === $locale && ($locale === 'id' || $t->reviewed);
        });

        if (! $translation && $locale !== 'id') {
            /** @var GuruTranslation|null $translation */
            $translation = $this->translations->first(function (GuruTranslation $t) {
                return $t->locale === 'id';
            });
        }

        if (! $translation) {
            /** @var GuruTranslation|null $translation */
            $translation = $this->translations->first();
        }

        return $translation;
    }

    public function getNamaLengkapAttribute(): string
    {
        $depan = $this->gelar_depan ? trim($this->gelar_depan).' ' : '';
        $belakang = $this->gelar_belakang ? ', '.trim($this->gelar_belakang) : '';

        return $depan.$this->nama.$belakang;
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('foto')->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('webp')
            ->format('webp')
            ->quality(80);

        $this->addMediaConversion('thumb')
            ->width(400)
            ->height(400)
            ->format('webp')
            ->quality(80);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeKelompok(Builder $query, string $kelompok): Builder
    {
        return $query->where('kelompok', $kelompok);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('urutan')->orderBy('nama');
    }
}

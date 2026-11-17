<?php

namespace App\Models;

use App\Traits\LogsActivityTrait;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @property int $id
 * @property string $nama
 * @property string $peran
 * @property string $keterangan
 * @property bool $persetujuan_tampil
 * @property bool $is_active
 * @property int $urutan
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Testimoni extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, LogsActivityTrait;

    protected $table = 'testimoni';

    protected $fillable = [
        'nama',
        'peran',
        'keterangan',
        'persetujuan_tampil',
        'is_active',
        'urutan',
    ];

    protected $casts = [
        'persetujuan_tampil' => 'boolean',
        'is_active' => 'boolean',
        'urutan' => 'integer',
    ];

    /**
     * @return HasMany<TestimoniTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(TestimoniTranslation::class);
    }

    public function translation(?string $locale = null): ?TestimoniTranslation
    {
        $locale = $locale ?? app()->getLocale();

        return $this->translations->first(function (TestimoniTranslation $t) use ($locale) {
            return $t->locale === $locale;
        }) ?? $this->translations->first(function (TestimoniTranslation $t) {
            return $t->locale === 'id';
        });
    }

    /**
     * Scope untuk halaman publik: hanya jika is_active true DAN persetujuan_tampil true.
     *
     * @param  Builder<Testimoni>  $query
     * @return Builder<Testimoni>
     */
    public function scopeTampil(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where('persetujuan_tampil', true);
    }

    /**
     * @param  Builder<Testimoni>  $query
     * @return Builder<Testimoni>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('urutan')->orderBy('id');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('foto')
            ->singleFile()
            ->useDisk('public')
            ->registerMediaConversions(function (Media $media) {
                $this->addMediaConversion('thumb')
                    ->width(200)
                    ->height(200)
                    ->format('webp');

                $this->addMediaConversion('webp')
                    ->width(400)
                    ->height(400)
                    ->format('webp');
            });
    }
}

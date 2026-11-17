<?php

namespace App\Models;

use App\Traits\LogsActivityTrait;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @property int $id
 * @property string $nama
 * @property string $bidang
 * @property string|null $url
 * @property int $urutan
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Mitra extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, LogsActivityTrait;

    protected $table = 'mitra';

    protected $fillable = [
        'nama',
        'bidang',
        'url',
        'urutan',
        'is_active',
    ];

    protected $casts = [
        'urutan' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * @return BelongsToMany<Jurusan, $this>
     */
    public function jurusans(): BelongsToMany
    {
        return $this->belongsToMany(Jurusan::class, 'jurusan_mitra', 'mitra_id', 'jurusan_id')
            ->withTimestamps();
    }

    /**
     * @param  Builder<Mitra>  $query
     * @return Builder<Mitra>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<Mitra>  $query
     * @return Builder<Mitra>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('urutan')->orderBy('id');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('logo')
            ->singleFile()
            ->useDisk('public')
            ->registerMediaConversions(function (Media $media) {
                $this->addMediaConversion('thumb')
                    ->width(200)
                    ->height(100)
                    ->format('webp');

                $this->addMediaConversion('webp')
                    ->width(400)
                    ->height(200)
                    ->format('webp');
            });
    }
}

<?php

namespace App\Models;

use App\Traits\LogsActivityTrait;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $youtube_id
 * @property int|null $galeri_id
 * @property int $urutan
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Video extends Model
{
    use HasFactory, LogsActivityTrait;

    protected $table = 'video';

    protected $fillable = [
        'youtube_id',
        'galeri_id',
        'urutan',
        'is_active',
    ];

    protected $casts = [
        'galeri_id' => 'integer',
        'urutan' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * @return BelongsTo<Galeri, $this>
     */
    public function galeri(): BelongsTo
    {
        return $this->belongsTo(Galeri::class, 'galeri_id');
    }

    /**
     * @return HasMany<VideoTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(VideoTranslation::class);
    }

    public function translation(?string $locale = null): ?VideoTranslation
    {
        $locale = $locale ?? app()->getLocale();

        return $this->translations->first(function (VideoTranslation $t) use ($locale) {
            return $t->locale === $locale;
        }) ?? $this->translations->first(function (VideoTranslation $t) {
            return $t->locale === 'id';
        });
    }

    /**
     * @param  Builder<Video>  $query
     * @return Builder<Video>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @param  Builder<Video>  $query
     * @return Builder<Video>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('urutan')->orderByDesc('id');
    }

    public function getThumbnailUrlAttribute(): string
    {
        return "https://i.ytimg.com/vi/{$this->youtube_id}/hqdefault.jpg";
    }

    public function getWatchUrlAttribute(): string
    {
        return "https://www.youtube.com/watch?v={$this->youtube_id}";
    }
}

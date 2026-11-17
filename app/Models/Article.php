<?php

namespace App\Models;

use App\Enums\ArticleStatus;
use App\Traits\LogsActivityTrait;
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
use Spatie\Tags\HasTags;

class Article extends Model implements HasMedia
{
    use HasFactory, HasSlug, HasTags, InteractsWithMedia, LogsActivityTrait;

    protected $fillable = [
        'user_id',
        'category_id',
        'slug',
        'status',
        'is_featured',
        'view_count',
        'published_at',
        'meta_title',
        'meta_description',
        'og_image',
        'catatan_review',
    ];

    protected $casts = [
        'status' => ArticleStatus::class,
        'is_featured' => 'boolean',
        'view_count' => 'integer',
        'published_at' => 'datetime',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(function ($model) {
                // If translation title is available in the payload or already saved
                // Since this runs on saving, we might not have translation relationship loaded if they are pushed simultaneously
                // Usually it's better to manually specify a string or handle it gracefully
                if (request()->has('title')) {
                    return request()->input('title');
                }

                $translation = $model->translation(app()->getLocale());

                return $translation ? $translation->title : 'untitled';
            })
            ->saveSlugsTo('slug');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('thumbnail')->singleFile();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function translations(): HasMany
    {
        return $this->hasMany(ArticleTranslation::class);
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(ArticleRevision::class)->latest();
    }

    public function translation(?string $locale = null)
    {
        $locale = $locale ?? app()->getLocale();

        return $this->translations->first(function ($t) use ($locale) {
            return $t->locale === $locale && ($locale === 'id' || $t->reviewed);
        })
            ?? $this->translations->where('locale', 'id')->first()
            ?? $this->translations->first();
    }

    public function scopePublished(Builder $query): Builder
    {
        return $this->scopeTerbit($query);
    }

    public function scopeTerbit(Builder $query): Builder
    {
        return $query->where('status', ArticleStatus::Published->value)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
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

    public function scopeByLocale(Builder $query, ?string $locale = null): Builder
    {
        $locale = $locale ?? app()->getLocale();

        return $query->whereHas('translations', function ($q) use ($locale) {
            $q->where('locale', $locale);
            if ($locale !== 'id') {
                $q->where('reviewed', true);
            }
        });
    }
}

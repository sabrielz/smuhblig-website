<?php

namespace App\Models;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\Tags\HasTags;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Article extends Model implements HasMedia
{
    use HasFactory, HasSlug, InteractsWithMedia, HasTags;

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
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'view_count' => 'integer',
        'published_at' => 'datetime',
    ];

    public function getSlugOptions() : SlugOptions
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

    public function translation(?string $locale = null)
    {
        $locale = $locale ?? app()->getLocale();
        return $this->translations->where('locale', $locale)->first() 
            ?? $this->translations->where('locale', 'id')->first()
            ?? $this->translations->first();
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
                     ->whereNotNull('published_at')
                     ->where('published_at', '<=', now());
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeByLocale(Builder $query, string $locale = null): Builder
    {
        $locale = $locale ?? app()->getLocale();
        return $query->whereHas('translations', function ($q) use ($locale) {
            $q->where('locale', $locale);
        });
    }
}

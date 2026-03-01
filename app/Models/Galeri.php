<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Galeri extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $table = 'galeri';

    protected $fillable = [
        'slug',
        'event_date',
        'is_featured',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'event_date' => 'date',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(GaleriTranslation::class);
    }

    public function translation(string $locale)
    {
        return $this->translations()->where('locale', $locale)->first();
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('photos');
    }
}

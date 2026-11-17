<?php

namespace App\Models;

use App\Traits\LogsActivityTrait;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class StrukturOrganisasi extends Model implements HasMedia
{
    use InteractsWithMedia, LogsActivityTrait;

    protected $fillable = [
        'parent_id',
        'nama',
        'jabatan',
        'jabatan_en',
        'foto',
        'urutan',
        'is_active',
        'level',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(StrukturOrganisasi::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(StrukturOrganisasi::class, 'parent_id');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('foto')->singleFile();
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

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}

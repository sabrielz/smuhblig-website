<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Support\Carbon;

class Pengumuman extends Model
{
    use HasFactory, HasSlug;

    protected $table = 'pengumuman';

    protected $fillable = [
        'user_id',
        'slug',
        'tipe',
        'tanggal_mulai',
        'tanggal_selesai',
        'is_active',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'is_active' => 'boolean',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(function ($model) {
                // If translation exists, use its judul
                $translation = $model->translations()->where('locale', 'id')->first();
                if ($translation && $translation->judul) {
                    return $translation->judul;
                }

                // If there's an active locale string
                if (request()->has('judul')) {
                    return request()->input('judul');
                }

                return 'pengumuman-' . uniqid();
            })
            ->saveSlugsTo('slug');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function translations(): HasMany
    {
        return $this->hasMany(PengumumanTranslation::class);
    }

    public function translation(string $locale)
    {
        return $this->translations()->where('locale', $locale)->first();
    }

    public function scopeActive(Builder $query): Builder
    {
        $today = Carbon::today();
        return $query->where('is_active', true)
                     ->where(function ($q) use ($today) {
                         $q->whereNull('tanggal_mulai')
                           ->orWhere('tanggal_mulai', '<=', $today);
                     })
                     ->where(function ($q) use ($today) {
                         $q->whereNull('tanggal_selesai')
                           ->orWhere('tanggal_selesai', '>=', $today);
                     });
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Support\Carbon;

class Agenda extends Model
{
    use HasSlug;

    protected $fillable = [
        'slug',
        'tanggal_mulai',
        'tanggal_selesai',
        'warna',
        'tipe',
        'is_active',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'is_active' => 'boolean',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(AgendaTranslation::class);
    }

    public function translation($locale = 'id')
    {
        return $this->translations()->where('locale', $locale)->first();
    }

    public function getJudulAttribute()
    {
        $translation = $this->translation('id') ?? $this->translations()->first();
        return $translation ? $translation->judul : 'Agenda-' . mt_rand(1000, 9999);
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('judul')
            ->saveSlugsTo('slug');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->whereDate('tanggal_mulai', '>=', Carbon::now()->toDateString())
            ->orderBy('tanggal_mulai', 'asc');
    }

    public function scopeByBulan(Builder $query, $bulan, $tahun): Builder
    {
        return $query->whereMonth('tanggal_mulai', $bulan)
                     ->whereYear('tanggal_mulai', $tahun);
    }
}

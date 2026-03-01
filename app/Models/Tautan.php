<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tautan extends Model
{
    use HasFactory;

    protected $table = 'tautan';

    protected $fillable = [
        'label',
        'label_en',
        'url',
        'deskripsi',
        'deskripsi_en',
        'icon_name',
        'kategori',
        'is_active',
        'sort_order',
        'buka_tab_baru',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'buka_tab_baru' => 'boolean',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order', 'asc');
    }
}

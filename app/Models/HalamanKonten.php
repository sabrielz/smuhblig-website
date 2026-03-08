<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HalamanKonten extends Model
{
    protected $fillable = [
        'halaman',
        'section',
        'key',
        'type',
        'label',
        'sort_order',
    ];

    public function translations(): HasMany
    {
        return $this->hasMany(HalamanKontenTranslation::class);
    }

    public static function get(string $halaman, string $section, string $key, string $locale = 'id', $default = null)
    {
        $konten = self::where('halaman', $halaman)
            ->where('section', $section)
            ->where('key', $key)
            ->with(['translations' => function ($query) use ($locale) {
                $query->where('locale', $locale);
            }])
            ->first();

        if (!$konten) {
            return $default;
        }

        $translation = $konten->translations->first();
        return $translation ? $translation->value : $default;
    }

    public static function getSection(string $halaman, string $section, string $locale): array
    {
        $cacheKey = "konten_{$halaman}_{$section}_{$locale}";
        $cacheTime = 3600;

        $closure = function () use ($halaman, $section, $locale) {
            $kontenList = self::where('halaman', $halaman)
                ->where('section', $section)
                ->with(['translations' => function ($query) use ($locale) {
                    $query->whereIn('locale', [$locale, 'id']);
                }])
                ->get();

            $result = [];
            foreach ($kontenList as $item) {
                $translations = $item->translations->keyBy('locale');
                $value = null;

                if ($translations->has($locale) && !empty($translations->get($locale)->value)) {
                    $value = $translations->get($locale)->value;
                } elseif ($translations->has('id') && !empty($translations->get('id')->value)) {
                    $value = $translations->get('id')->value;
                }

                $result[$item->key] = $value;
            }

            return $result;
        };

        if (\Illuminate\Support\Facades\Cache::supportsTags()) {
            return \Illuminate\Support\Facades\Cache::tags(["halaman_{$halaman}"])->remember($cacheKey, $cacheTime, $closure);
        }

        return \Illuminate\Support\Facades\Cache::remember($cacheKey, $cacheTime, $closure);
    }
}

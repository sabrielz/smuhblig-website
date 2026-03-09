<?php

namespace App\Http\Resources;

use App\Models\Jurusan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Jurusan
 */
class JurusanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $translation = $this->translation();
        $locale = app()->getLocale();

        /** @var \App\Models\JurusanTranslation|null $translation */
        return [
            'id'                => $this->id,
            'kode'              => $this->kode,
            'slug'              => $this->slug,
            'color_start'       => $this->color_start,
            'color_end'         => $this->color_end,
            'icon_name'         => $this->icon_name,
            'sort_order'        => $this->sort_order,
            'is_active'         => $this->is_active,

            // Meta info
            'akreditasi'        => $this->akreditasi,
            'total_siswa'       => $this->total_siswa,
            'lama_pendidikan'   => $this->lama_pendidikan,

            // Highlight icons
            'highlight_1_icon'  => $this->highlight_1_icon,
            'highlight_2_icon'  => $this->highlight_2_icon,
            'highlight_3_icon'  => $this->highlight_3_icon,

            // Translation fields (locale-aware, fallback 'id')
            'nama'              => $translation?->nama ?? '',
            'tagline'           => $translation?->tagline,
            'deskripsi_singkat' => $translation?->deskripsi_singkat,
            'deskripsi_lengkap' => $translation?->deskripsi_lengkap,
            'konten_hero'       => $translation?->konten_hero,
            'kompetensi'        => $translation?->kompetensi ?? [],
            'prospek_karir'     => $translation?->prospek_karir ?? [],
            'fasilitas'         => $translation?->fasilitas ?? [],

            // Highlight labels
            'highlight_1_label' => $locale === 'en' ? ($translation?->highlight_1_en ?: $translation?->highlight_1_label) : $translation?->highlight_1_label,
            'highlight_2_label' => $locale === 'en' ? ($translation?->highlight_2_en ?: $translation?->highlight_2_label) : $translation?->highlight_2_label,
            'highlight_3_label' => $locale === 'en' ? ($translation?->highlight_3_en ?: $translation?->highlight_3_label) : $translation?->highlight_3_label,

            // Media
            'cover_image'       => $this->getFirstMediaUrl('cover') ?: null,
            'gallery_images'    => $this->getMedia('gallery')->map(fn($media) => $media->getUrl())->toArray(),
        ];
    }
}

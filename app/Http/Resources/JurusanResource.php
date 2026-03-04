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

            // Translation fields (locale-aware, fallback 'id')
            'nama'              => $translation?->nama ?? '',
            'tagline'           => $translation?->tagline,
            'deskripsi_singkat' => $translation?->deskripsi_singkat,
            'deskripsi_lengkap' => $translation?->deskripsi_lengkap,
            'kompetensi'        => $translation?->kompetensi ?? [],
            'prospek_karir'     => $translation?->prospek_karir ?? [],
            'fasilitas'         => $translation?->fasilitas ?? [],

            // Media
            'cover_image'       => $this->getFirstMediaUrl('cover') ?: null,
        ];
    }
}

<?php

namespace App\Http\Resources\Public;

use App\Models\Pengumuman;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Pengumuman
 */
class PengumumanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $locale = app()->getLocale();
        $translation = $this->translation($locale) ?? $this->translation('id');

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'tipe' => $this->tipe,
            'judul' => $translation ? $translation->judul : '-',
            'konten' => $translation ? $translation->konten : '',
            'tanggal_mulai' => $this->tanggal_mulai?->format('Y-m-d'),
            'tanggal_selesai' => $this->tanggal_selesai?->format('Y-m-d'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}

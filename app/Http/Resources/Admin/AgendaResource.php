<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgendaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'tanggal_mulai' => $this->tanggal_mulai->format('Y-m-d'),
            'tanggal_selesai' => $this->tanggal_selesai ? $this->tanggal_selesai->format('Y-m-d') : null,
            'warna' => $this->warna,
            'tipe' => $this->tipe,
            'is_active' => $this->is_active,
            'translations' => [
                'id' => $this->translations->where('locale', 'id')->first() ?: null,
                'en' => $this->translations->where('locale', 'en')->first() ?: null,
            ],
            // For convenience in frontend listing
            'judul_id' => $this->translations->where('locale', 'id')->first()?->judul,
            'judul_en' => $this->translations->where('locale', 'en')->first()?->judul,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}

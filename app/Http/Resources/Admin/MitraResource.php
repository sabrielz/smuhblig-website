<?php

namespace App\Http\Resources\Admin;

use App\Models\Jurusan;
use App\Models\Mitra;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Mitra
 */
class MitraResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $media = $this->getFirstMedia('logo');

        return [
            'id' => $this->id,
            'nama' => $this->nama,
            'bidang' => $this->bidang,
            'url' => $this->url,
            'urutan' => $this->urutan,
            'is_active' => $this->is_active,
            'logo_url' => $media ? ($media->getUrl('webp') ?: $media->getUrl()) : null,
            'jurusan_ids' => $this->jurusans->pluck('id')->all(),
            'jurusans' => $this->jurusans->map(function (Jurusan $j) {
                $trans = $j->translation();

                return [
                    'id' => $j->id,
                    'kode' => $j->kode,
                    'nama' => $trans ? $trans->nama : $j->kode,
                ];
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

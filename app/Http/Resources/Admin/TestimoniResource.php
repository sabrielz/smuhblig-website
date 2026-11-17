<?php

namespace App\Http\Resources\Admin;

use App\Models\Testimoni;
use App\Models\TestimoniTranslation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Testimoni
 */
class TestimoniResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $idTrans = $this->translations->first(function (TestimoniTranslation $t) {
            return $t->locale === 'id';
        });

        $enTrans = $this->translations->first(function (TestimoniTranslation $t) {
            return $t->locale === 'en';
        });

        $media = $this->getFirstMedia('foto');

        return [
            'id' => $this->id,
            'nama' => $this->nama,
            'peran' => $this->peran,
            'keterangan' => $this->keterangan,
            'persetujuan_tampil' => $this->persetujuan_tampil,
            'is_active' => $this->is_active,
            'urutan' => $this->urutan,
            'foto_url' => $media ? ($media->getUrl('webp') ?: $media->getUrl()) : null,
            'translations' => [
                'id' => [
                    'kutipan' => $idTrans ? $idTrans->kutipan : null,
                ],
                'en' => [
                    'kutipan' => $enTrans ? $enTrans->kutipan : null,
                ],
            ],
            'kutipan' => $idTrans ? $idTrans->kutipan : null,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

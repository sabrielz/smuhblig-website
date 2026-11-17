<?php

namespace App\Http\Resources\Admin;

use App\Models\Fasilitas;
use App\Models\FasilitasTranslation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @mixin Fasilitas
 */
class FasilitasResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $idTrans = $this->translations->first(function (FasilitasTranslation $t) {
            return $t->locale === 'id';
        });

        $enTrans = $this->translations->first(function (FasilitasTranslation $t) {
            return $t->locale === 'en';
        });

        $mediaList = $this->getMedia('foto')->map(function (Media $m) {
            return [
                'id' => $m->id,
                'url' => $m->getUrl('webp') ?: $m->getUrl(),
                'thumb_url' => $m->getUrl('thumb') ?: $m->getUrl(),
                'file_name' => $m->file_name,
                'size' => $m->size,
            ];
        });

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'kategori' => $this->kategori,
            'urutan' => $this->urutan,
            'is_active' => $this->is_active,
            'media' => $mediaList,
            'cover_url' => $mediaList->first()['url'] ?? null,
            'translations' => [
                'id' => [
                    'nama' => $idTrans ? $idTrans->nama : '',
                    'deskripsi' => $idTrans ? $idTrans->deskripsi : '',
                ],
                'en' => [
                    'nama' => $enTrans ? $enTrans->nama : '',
                    'deskripsi' => $enTrans ? $enTrans->deskripsi : '',
                ],
            ],
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}

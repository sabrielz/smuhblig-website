<?php

namespace App\Http\Resources\Admin;

use App\Models\Unduhan;
use App\Models\UnduhanTranslation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Unduhan
 */
class UnduhanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $idTrans = $this->translations->first(function (UnduhanTranslation $t) {
            return $t->locale === 'id';
        });

        $enTrans = $this->translations->first(function (UnduhanTranslation $t) {
            return $t->locale === 'en';
        });

        $media = $this->getFirstMedia('berkas');

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'kategori' => $this->kategori,
            'tanggal_terbit' => $this->tanggal_terbit?->format('Y-m-d'),
            'jumlah_unduh' => $this->jumlah_unduh,
            'is_active' => $this->is_active,
            'file' => $media ? [
                'id' => $media->id,
                'file_name' => $media->file_name,
                'mime_type' => $media->mime_type,
                'extension' => $media->extension,
                'size' => $media->size,
                'human_size' => $media->human_readable_size,
            ] : null,
            'translations' => [
                'id' => [
                    'judul' => $idTrans ? $idTrans->judul : null,
                    'deskripsi' => $idTrans ? $idTrans->deskripsi : null,
                ],
                'en' => [
                    'judul' => $enTrans ? $enTrans->judul : null,
                    'deskripsi' => $enTrans ? $enTrans->deskripsi : null,
                ],
            ],
            'judul' => $idTrans ? $idTrans->judul : null,
            'deskripsi' => $idTrans ? $idTrans->deskripsi : null,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

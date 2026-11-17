<?php

namespace App\Http\Resources\Admin;

use App\Models\Video;
use App\Models\VideoTranslation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Video
 */
class VideoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $idTrans = $this->translations->first(function (VideoTranslation $t) {
            return $t->locale === 'id';
        });

        $enTrans = $this->translations->first(function (VideoTranslation $t) {
            return $t->locale === 'en';
        });

        return [
            'id' => $this->id,
            'youtube_id' => $this->youtube_id,
            'thumbnail_url' => $this->thumbnail_url,
            'watch_url' => $this->watch_url,
            'galeri_id' => $this->galeri_id,
            'galeri' => $this->galeri ? [
                'id' => $this->galeri->id,
                'judul' => ($trans = $this->galeri->translation()) ? $trans->title : $this->galeri->slug,
            ] : null,
            'urutan' => $this->urutan,
            'is_active' => $this->is_active,
            'translations' => [
                'id' => [
                    'judul' => $idTrans ? $idTrans->judul : null,
                ],
                'en' => [
                    'judul' => $enTrans ? $enTrans->judul : null,
                ],
            ],
            'judul' => $idTrans ? $idTrans->judul : null,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

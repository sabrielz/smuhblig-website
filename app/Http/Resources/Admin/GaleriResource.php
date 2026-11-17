<?php

namespace App\Http\Resources\Admin;

use App\Models\Galeri;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Galeri
 */
class GaleriResource extends JsonResource
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
            'judul' => $this->translation('id')?->judul ?? '-',
            'event_date' => $this->event_date?->format('Y-m-d'),
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'foto_count' => $this->media->count(),
            'thumbnail' => $this->getFirstMediaUrl('photos', 'preview') ?: $this->getFirstMediaUrl('photos'),
        ];
    }
}

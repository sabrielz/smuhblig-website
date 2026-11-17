<?php

namespace App\Http\Resources\Admin;

use App\Models\NotifikasiAdmin;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin NotifikasiAdmin
 */
class NotifikasiAdminResource extends JsonResource
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
            'tipe' => $this->tipe,
            'judul' => $this->judul,
            'pesan' => $this->pesan,
            'url' => $this->url,
            'dibaca' => ! is_null($this->dibaca_at),
            'dibaca_at' => $this->dibaca_at?->diffForHumans(),
            'created_at' => $this->created_at->diffForHumans(),
        ];
    }
}

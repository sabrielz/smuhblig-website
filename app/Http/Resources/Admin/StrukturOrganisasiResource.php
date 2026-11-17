<?php

namespace App\Http\Resources\Admin;

use App\Models\StrukturOrganisasi;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin StrukturOrganisasi
 */
class StrukturOrganisasiResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'nama' => $this->nama,
            'jabatan' => $this->jabatan,
            'jabatan_en' => $this->jabatan_en,
            'level' => $this->level,
            'parent_id' => $this->parent_id,
            'urutan' => $this->urutan,
            'is_active' => (bool) $this->is_active,
            'foto_url' => $this->getFirstMediaUrl('foto'),
        ];

        if ($this->relationLoaded('children')) {
            $data['children'] = StrukturOrganisasiResource::collection(
                collect($this->children)->sortBy('urutan')->values()
            )->resolve();
        }

        return $data;
    }
}

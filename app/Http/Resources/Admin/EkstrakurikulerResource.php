<?php

namespace App\Http\Resources\Admin;

use App\Models\Ekstrakurikuler;
use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Ekstrakurikuler
 */
class EkstrakurikulerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $idTrans = $this->translations->firstWhere('locale', 'id');
        $enTrans = $this->translations->firstWhere('locale', 'en');

        /** @var Guru|null $pembina */
        $pembina = $this->pembina;

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'pembina_guru_id' => $this->pembina_guru_id,
            'pembina' => $pembina ? [
                'id' => $pembina->id,
                'nama' => $pembina->nama,
                'nama_lengkap' => $pembina->nama_lengkap,
            ] : null,
            'urutan' => $this->urutan,
            'is_active' => $this->is_active,
            'foto_url' => $this->getFirstMediaUrl('foto', 'medium') ?: $this->getFirstMediaUrl('foto') ?: null,
            'translations' => [
                'id' => [
                    'nama' => $idTrans ? $idTrans->nama : '',
                    'deskripsi' => $idTrans ? $idTrans->deskripsi : '',
                    'jadwal' => $idTrans ? $idTrans->jadwal : '',
                ],
                'en' => [
                    'nama' => $enTrans ? $enTrans->nama : '',
                    'deskripsi' => $enTrans ? $enTrans->deskripsi : '',
                    'jadwal' => $enTrans ? $enTrans->jadwal : '',
                ],
            ],
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}

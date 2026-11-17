<?php

namespace App\Http\Resources\Admin;

use App\Models\Guru;
use App\Models\GuruTranslation;
use App\Models\Jurusan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Guru
 */
class GuruResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $idTrans = $this->translations->first(function (GuruTranslation $t) {
            return $t->locale === 'id';
        });

        $enTrans = $this->translations->first(function (GuruTranslation $t) {
            return $t->locale === 'en';
        });

        /** @var Jurusan|null $jurusan */
        $jurusan = $this->jurusan;
        $jurusanTrans = $jurusan?->translation();

        return [
            'id' => $this->id,
            'nama' => $this->nama,
            'nama_lengkap' => $this->nama_lengkap,
            'gelar_depan' => $this->gelar_depan,
            'gelar_belakang' => $this->gelar_belakang,
            'kelompok' => $this->kelompok,
            'jurusan_id' => $this->jurusan_id,
            'jurusan' => $jurusan ? [
                'id' => $jurusan->id,
                'nama' => $jurusanTrans ? $jurusanTrans->nama : $jurusan->kode,
                'slug' => $jurusan->slug,
            ] : null,
            'urutan' => $this->urutan,
            'is_active' => $this->is_active,
            'foto_url' => $this->getFirstMediaUrl('foto', 'webp') ?: $this->getFirstMediaUrl('foto') ?: null,
            'translations' => [
                'id' => [
                    'jabatan' => $idTrans ? $idTrans->jabatan : '',
                    'mapel' => $idTrans ? $idTrans->mapel : '',
                ],
                'en' => [
                    'jabatan' => $enTrans ? $enTrans->jabatan : '',
                    'mapel' => $enTrans ? $enTrans->mapel : '',
                ],
            ],
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}

<?php

namespace App\Http\Resources\Admin;

use App\Models\Jurusan;
use App\Models\Prestasi;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Prestasi
 */
class PrestasiResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $idTrans = $this->translations->firstWhere('locale', 'id');
        $enTrans = $this->translations->firstWhere('locale', 'en');

        /** @var Jurusan|null $jurusan */
        $jurusan = $this->jurusan;
        $jurusanTrans = $jurusan?->translation('id');

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'tingkat' => $this->tingkat->value,
            'tingkat_label' => $this->tingkat->label('id'),
            'kategori' => $this->kategori->value,
            'kategori_label' => $this->kategori->label('id'),
            'tahun' => $this->tahun,
            'tanggal' => $this->tanggal?->format('Y-m-d'),
            'jurusan_id' => $this->jurusan_id,
            'jurusan' => $jurusan ? [
                'id' => $jurusan->id,
                'nama' => $jurusanTrans ? $jurusanTrans->nama : $jurusan->kode,
                'slug' => $jurusan->slug,
            ] : null,
            'is_active' => $this->is_active,
            'foto_url' => $this->getFirstMediaUrl('foto', 'medium') ?: $this->getFirstMediaUrl('foto') ?: null,
            'translations' => [
                'id' => [
                    'judul' => $idTrans ? $idTrans->judul : '',
                    'ringkasan' => $idTrans ? $idTrans->ringkasan : '',
                ],
                'en' => [
                    'judul' => $enTrans ? $enTrans->judul : '',
                    'ringkasan' => $enTrans ? $enTrans->ringkasan : '',
                ],
            ],
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}

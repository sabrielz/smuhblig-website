<?php

namespace App\Http\Resources\Admin;

use App\Models\Pengumuman;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Pengumuman
 */
class PengumumanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $today = Carbon::today();
        $isExpired = $this->tanggal_selesai && $this->tanggal_selesai->lt($today);
        $isActive = $this->is_active && ! $isExpired;

        return [
            'id' => $this->id,
            'judul' => $this->translation('id')?->judul ?? '-',
            'tipe' => $this->tipe,
            'tanggal_mulai' => $this->tanggal_mulai?->format('Y-m-d'),
            'tanggal_selesai' => $this->tanggal_selesai?->format('Y-m-d'),
            'is_active' => $isActive,
            'status_label' => $isActive ? 'Aktif' : ($isExpired ? 'Kadaluarsa' : 'Tidak Aktif'),
        ];
    }
}

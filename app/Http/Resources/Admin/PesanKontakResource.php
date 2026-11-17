<?php

namespace App\Http\Resources\Admin;

use App\Models\PesanKontak;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PesanKontak
 */
class PesanKontakResource extends JsonResource
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
            'nama' => $this->nama,
            'email' => $this->email,
            'nomor_telepon' => $this->nomor_telepon,
            'subjek' => $this->subjek,
            'status' => $this->status,
            'ip_address' => $this->ip_address,
            'dibaca_at' => $this->dibaca_at?->toISOString(),
            'dibaca_oleh' => $this->pembaca?->name,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}

<?php

namespace App\Http\Resources\Admin;

use App\Models\Tautan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Tautan
 */
class TautanResource extends JsonResource
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
            'label' => $this->label,
            'label_en' => $this->label_en,
            'url' => $this->url,
            'icon_name' => $this->icon_name,
            'kategori' => $this->kategori,
            'sort_order' => $this->sort_order,
            'buka_tab_baru' => $this->buka_tab_baru,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

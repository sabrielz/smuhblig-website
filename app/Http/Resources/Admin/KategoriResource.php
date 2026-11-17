<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Models\Category;
use App\Models\CategoryTranslation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Category
 */
class KategoriResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var CategoryTranslation|null $idTrans */
        $idTrans = $this->translations->firstWhere('locale', 'id');
        /** @var CategoryTranslation|null $enTrans */
        $enTrans = $this->translations->firstWhere('locale', 'en');

        return [
            'id' => $this->id,
            'name' => $idTrans ? $idTrans->name : $this->name,
            'slug' => $this->slug,
            'color' => $this->color,
            'is_active' => (bool) $this->is_active,
            'sort_order' => (int) $this->sort_order,
            'articles_count' => $this->articles_count ?? $this->articles()->count(),
            'translations' => [
                'id' => [
                    'name' => $idTrans ? $idTrans->name : $this->name,
                    'description' => $idTrans ? $idTrans->description : $this->description,
                ],
                'en' => [
                    'name' => $enTrans ? $enTrans->name : '',
                    'description' => $enTrans ? $enTrans->description : '',
                ],
            ],
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}

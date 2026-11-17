<?php

namespace App\Http\Resources\Admin;

use App\Models\Faq;
use App\Models\FaqTranslation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Faq
 */
class FaqResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $idTrans = $this->translations->first(function (FaqTranslation $t) {
            return $t->locale === 'id';
        });

        $enTrans = $this->translations->first(function (FaqTranslation $t) {
            return $t->locale === 'en';
        });

        return [
            'id' => $this->id,
            'kategori' => $this->kategori,
            'urutan' => $this->urutan,
            'is_active' => $this->is_active,
            'translations' => [
                'id' => [
                    'pertanyaan' => $idTrans ? $idTrans->pertanyaan : null,
                    'jawaban' => $idTrans ? $idTrans->jawaban : null,
                ],
                'en' => [
                    'pertanyaan' => $enTrans ? $enTrans->pertanyaan : null,
                    'jawaban' => $enTrans ? $enTrans->jawaban : null,
                ],
            ],
            'pertanyaan' => $idTrans ? $idTrans->pertanyaan : null,
            'jawaban' => $idTrans ? $idTrans->jawaban : null,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

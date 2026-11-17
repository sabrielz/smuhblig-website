<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArtikelResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $translationId = $this->translations->where('locale', 'id')->first();
        $translationEn = $this->translations->where('locale', 'en')->first();

        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', function () {
                $catTrans = $this->category->translation('id');

                return [
                    'id' => $this->category->id,
                    'name' => $catTrans ? $catTrans->name : $this->category->name,
                    'color' => $this->category->color,
                ];
            }),
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                ];
            }),
            'slug' => $this->slug,
            'status' => $this->status,
            'published_at' => $this->published_at ? $this->published_at->format('Y-m-d\TH:i:s') : null,
            'formatted_published_at' => $this->published_at ? $this->published_at->format('d M Y') : null,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'thumbnail_url' => $this->getFirstMediaUrl('thumbnail'),

            // Text Content (ID)
            'title_id' => $translationId ? $translationId->title : '',
            'excerpt_id' => $translationId ? $translationId->excerpt : '',
            'content_id' => $translationId ? $translationId->content : '',

            // Text Content (EN)
            'title_en' => $translationEn ? $translationEn->title : '',
            'excerpt_en' => $translationEn ? $translationEn->excerpt : '',
            'content_en' => $translationEn ? $translationEn->content : '',

            // EN translation status flags (for AI badge in editor)
            'en_ai_translated' => $translationEn ? (bool) $translationEn->ai_translated : false,
            'en_reviewed' => $translationEn ? (bool) $translationEn->reviewed : false,

            // Tags
            'tags' => $this->resource->tags ? $this->resource->tags->pluck('name')->toArray() : [],

            // Riwayat Revisi (Sesi 6-06)
            'revisions' => $this->resource->relationLoaded('revisions') && $this->resource->revisions ? $this->resource->revisions->map(function ($rev) {
                return [
                    'id' => $rev->id,
                    'user' => $rev->user ? [
                        'id' => $rev->user->id,
                        'name' => $rev->user->name,
                    ] : null,
                    'snapshot' => $rev->snapshot,
                    'created_at' => $rev->created_at?->format('Y-m-d H:i:s'),
                    'human_time' => $rev->created_at?->diffForHumans(),
                ];
            }) : [],
        ];
    }
}

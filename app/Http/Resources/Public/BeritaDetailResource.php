<?php

namespace App\Http\Resources\Public;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Article
 */
class BeritaDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $translation = $this->translation();
        /** @var Category|null $category */
        $category = $this->category;
        /** @var User|null $author */
        $author = $this->user;

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $translation?->title,
            'excerpt' => $translation?->excerpt,
            'content' => $translation?->content,
            'published_at' => $this->published_at ? $this->published_at->format('d M Y') : '',
            'category' => [
                'id' => $this->category_id,
                'name' => $category ? $category->translation()?->name : null,
                'slug' => $category ? $category->slug : null,
                'color' => '#003f87',
            ],
            'author' => [
                'name' => $author ? $author->name : 'Admin',
                'avatar' => $author ? $author->avatar_url : 'https://ui-avatars.com/api/?name=Admin',
            ],
            'thumbnail' => $this->getFirstMediaUrl('thumbnail', 'large') ?: ($this->getFirstMediaUrl('thumbnail') ?: 'https://placehold.co/1200x600'),
            'thumbnail_srcset' => $this->getFirstMedia('thumbnail')?->hasGeneratedConversion('thumb')
                ? "{$this->getFirstMediaUrl('thumbnail', 'thumb')} 400w, {$this->getFirstMediaUrl('thumbnail', 'large')} 1200w"
                : null,
            'thumbnail_alt' => $translation?->title ?: 'Thumbnail Berita',
            'tags' => array_map(function ($tag) {
                return [
                    'id' => is_array($tag) ? ($tag['id'] ?? 0) : ($tag->id ?? 0),
                    'name' => is_array($tag) ? ($tag['name'] ?? '') : ($tag->name ?? ''),
                    'slug' => is_array($tag) ? ($tag['slug'] ?? '') : ($tag->slug ?? ''),
                ];
            }, $this->tags->toArray()),
        ];
    }
}

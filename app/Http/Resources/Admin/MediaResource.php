<?php

namespace App\Http\Resources\Admin;

use App\Support\MediaUsage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @mixin Media
 */
class MediaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Media $media */
        $media = $this->resource;

        return [
            'id' => $media->id,
            'uuid' => $media->uuid,
            'name' => $media->name,
            'file_name' => $media->file_name,
            'mime_type' => $media->mime_type,
            'disk' => $media->disk,
            'size' => $media->size,
            'human_size' => $media->human_readable_size,
            'collection_name' => $media->collection_name,
            'model_type' => $media->model_type ? class_basename($media->model_type) : null,
            'model_id' => $media->model_id,
            'url' => $media->disk === 'public' ? $media->getUrl() : null,
            'alt' => $media->getCustomProperty('alt', ''),
            'custom_properties' => $media->custom_properties,
            'is_used' => MediaUsage::isUsed($media),
            'created_at' => $media->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}

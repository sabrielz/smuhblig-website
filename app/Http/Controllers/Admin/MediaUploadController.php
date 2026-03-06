<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaUploadController extends Controller
{
    /**
     * Upload a temporary image from the TipTap editor toolbar.
     * The image is stored in storage/app/public/editor-uploads/{year}/{month}/
     * and served via /storage/… public symlink.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'], // max 5MB
        ]);

        $file = $request->file('image');

        // Build a namespaced path: editor-uploads/2026/03/uuid.ext
        $yearMonth = now()->format('Y/m');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = "editor-uploads/{$yearMonth}/{$filename}";

        Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));

        $url = Storage::disk('public')->url($path);

        return response()->json(['url' => $url]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MediaUploadController extends Controller
{
    /**
     * MIME types yang diizinkan untuk upload.
     * GIF dan SVG dilarang keras karena potensi XSS/animasi exploit.
     *
     * @var array<string, string>  key = mime type, value = extension
     */
    private const ALLOWED_MIMES = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
    ];

    /**
     * Upload a temporary image from the TipTap editor toolbar.
     * The image is stored in storage/app/public/editor-uploads/{year}/{month}/
     * and served via /storage/… public symlink.
     *
     * Security:
     * - Validasi MIME type via finfo (magic bytes), bukan hanya ekstensi
     * - Hanya izinkan: jpeg, jpg, png, webp
     * - Reject gif, svg, dan semua tipe lain
     * - Max 5MB per file
     * - Filename di-UUID-kan oleh Spatie; di sini manual UUID
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'file', 'max:5120'], // max 5MB — validasi lanjutan di bawah
        ]);

        /** @var UploadedFile $file */
        $file = $request->file('image');

        // Validasi MIME type via magic bytes (finfo) — bukan hanya ekstensi/Content-Type header
        $detectedMime = $this->detectMimeType($file->getRealPath());

        if (!array_key_exists($detectedMime, self::ALLOWED_MIMES)) {
            throw ValidationException::withMessages([
                'image' => 'Tipe file tidak diizinkan. Hanya JPEG, PNG, dan WebP yang diterima. GIF dan SVG dilarang.',
            ]);
        }

        // Gunakan ekstensi dari MIME type yang terdeteksi (bukan dari client)
        $extension = self::ALLOWED_MIMES[$detectedMime];

        // Build namespaced UUID path: editor-uploads/2026/03/uuid.ext
        $yearMonth = now()->format('Y/m');
        $filename  = Str::uuid() . '.' . $extension;
        $path      = "editor-uploads/{$yearMonth}/{$filename}";

        // Simpan ke public storage disk
        Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        $url  = $disk->url($path);

        return response()->json(['url' => $url]);
    }

    /**
     * Deteksi MIME type via finfo (magic bytes).
     * Lebih aman dari getClientMimeType() yang mengandalkan Content-Type header.
     */
    private function detectMimeType(string $filePath): string
    {
        if (function_exists('finfo_file')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime = finfo_file($finfo, $filePath);
            finfo_close($finfo);
            return $mime ?: 'application/octet-stream';
        }

        // Fallback ke mime_content_type() jika finfo tidak tersedia
        if (function_exists('mime_content_type')) {
            return mime_content_type($filePath) ?: 'application/octet-stream';
        }

        return 'application/octet-stream';
    }
}

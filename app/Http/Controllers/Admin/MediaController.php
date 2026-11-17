<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateMediaRequest;
use App\Http\Resources\Admin\MediaResource;
use App\Support\MediaUsage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaController extends Controller
{
    /**
     * Tampilkan pustaka media.
     * Akses: Editor & Admin.
     */
    public function index(Request $request): Response
    {
        $query = Media::query()->latest();

        // Filter tipe mime (gambar vs dokumen)
        if ($request->filled('type')) {
            $type = $request->input('type');
            if ($type === 'image') {
                $query->where('mime_type', 'LIKE', 'image/%');
            } elseif ($type === 'document') {
                $query->where('mime_type', 'NOT LIKE', 'image/%');
            }
        }

        // Filter model_type
        if ($request->filled('model_type')) {
            $query->where('model_type', 'LIKE', '%'.$request->input('model_type').'%');
        }

        // Pencarian nama/file_name
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('file_name', 'LIKE', "%{$search}%");
            });
        }

        $media = $query->paginate(24)->withQueryString();

        return Inertia::render('Admin/Media/Index', [
            'media' => MediaResource::collection($media),
            'filters' => [
                'type' => $request->input('type', ''),
                'model_type' => $request->input('model_type', ''),
                'search' => $request->input('search', ''),
            ],
        ]);
    }

    /**
     * Perbarui metadata media (alt text, nama).
     */
    public function update(UpdateMediaRequest $request, Media $medium): RedirectResponse
    {
        if ($request->has('alt')) {
            $medium->setCustomProperty('alt', (string) $request->input('alt'));
        }

        if ($request->filled('name')) {
            $medium->name = (string) $request->input('name');
        }

        $medium->save();

        return back()->with('flash.success', 'Metadata media berhasil diperbarui.');
    }

    /**
     * Hapus media (hanya bila tidak terpakai sesuai BR-030).
     */
    public function destroy(Media $medium): RedirectResponse
    {
        if (MediaUsage::isUsed($medium)) {
            return back()->with('flash.error', 'Media sedang terpakai dan tidak dapat dihapus (BR-030).');
        }

        $medium->delete();

        return back()->with('flash.success', 'Media berhasil dihapus.');
    }
}

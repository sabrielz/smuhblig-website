<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderFasilitasRequest;
use App\Http\Requests\Admin\StoreFasilitasRequest;
use App\Http\Requests\Admin\UpdateFasilitasRequest;
use App\Http\Resources\Admin\FasilitasResource;
use App\Models\Fasilitas;
use App\Services\HtmlSanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class FasilitasController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Fasilitas::class);

        $query = Fasilitas::query()->with(['translations', 'media']);

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->input('kategori'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('translations', function ($qt) use ($search) {
                    $qt->where('nama', 'like', "%{$search}%");
                });
            });
        }

        $fasilitas = $query->ordered()->paginate(15)->withQueryString()->through(function (Fasilitas $item) {
            return (new FasilitasResource($item))->resolve();
        });

        return Inertia::render('Admin/Fasilitas/Index', [
            'fasilitas' => $fasilitas,
            'filters' => $request->only(['kategori', 'search']),
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Fasilitas::class);

        return Inertia::render('Admin/Fasilitas/Form', [
            'fasilitas' => null,
        ]);
    }

    public function store(StoreFasilitasRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated) {
            $maxUrutan = Fasilitas::max('urutan') ?? 0;
            $namaId = $validated['translations']['id']['nama'];

            /** @var Fasilitas $fasilitas */
            $fasilitas = Fasilitas::create([
                'slug' => Str::slug($namaId),
                'kategori' => $validated['kategori'],
                'urutan' => $validated['urutan'] ?? ($maxUrutan + 1),
                'is_active' => $request->boolean('is_active', true),
            ]);

            $fasilitas->translations()->create([
                'locale' => 'id',
                'nama' => $namaId,
                'deskripsi' => ! empty($validated['translations']['id']['deskripsi'])
                    ? HtmlSanitizer::clean($validated['translations']['id']['deskripsi'])
                    : null,
                'ai_translated' => false,
                'reviewed' => true,
            ]);

            if (! empty($validated['translations']['en']['nama'])) {
                $fasilitas->translations()->create([
                    'locale' => 'en',
                    'nama' => $validated['translations']['en']['nama'],
                    'deskripsi' => ! empty($validated['translations']['en']['deskripsi'])
                        ? HtmlSanitizer::clean($validated['translations']['en']['deskripsi'])
                        : null,
                    'ai_translated' => false,
                    'reviewed' => true,
                ]);
            }

            if ($request->hasFile('fotos')) {
                foreach ($request->file('fotos') as $file) {
                    $fasilitas->addMedia($file)->toMediaCollection('foto');
                }
            }
        });

        Cache::forget('public.fasilitas.id');
        Cache::forget('public.fasilitas.en');

        return redirect()->route('admin.fasilitas.index')->with('success', 'Fasilitas berhasil ditambahkan.');
    }

    public function edit(Fasilitas $fasilita)
    {
        $fasilitas = $fasilita;
        Gate::authorize('update', $fasilitas);

        $fasilitas->load(['translations', 'media']);

        return Inertia::render('Admin/Fasilitas/Form', [
            'fasilitas' => (new FasilitasResource($fasilitas))->resolve(),
        ]);
    }

    public function update(UpdateFasilitasRequest $request, Fasilitas $fasilita)
    {
        $fasilitas = $fasilita;
        $validated = $request->validated();

        // Server-side check: maximum 8 photos allowed in total
        $currentPhotoCount = $fasilitas->getMedia('foto')->count();
        $deletedCount = ! empty($validated['deleted_media_ids']) ? count($validated['deleted_media_ids']) : 0;
        $newPhotoCount = $request->hasFile('fotos') ? count($request->file('fotos')) : 0;

        if (($currentPhotoCount - $deletedCount + $newPhotoCount) > 8) {
            return back()->withErrors(['fotos' => 'Maksimal 8 foto untuk setiap fasilitas.']);
        }

        DB::transaction(function () use ($request, $fasilitas, $validated) {
            $namaId = $validated['translations']['id']['nama'];

            $fasilitas->update([
                'slug' => Str::slug($namaId),
                'kategori' => $validated['kategori'],
                'urutan' => $validated['urutan'] ?? $fasilitas->urutan,
                'is_active' => $request->boolean('is_active', $fasilitas->is_active),
            ]);

            $fasilitas->translations()->updateOrCreate(
                ['locale' => 'id'],
                [
                    'nama' => $namaId,
                    'deskripsi' => ! empty($validated['translations']['id']['deskripsi'])
                        ? HtmlSanitizer::clean($validated['translations']['id']['deskripsi'])
                        : null,
                    'ai_translated' => false,
                    'reviewed' => true,
                ]
            );

            if (! empty($validated['translations']['en']['nama'])) {
                $fasilitas->translations()->updateOrCreate(
                    ['locale' => 'en'],
                    [
                        'nama' => $validated['translations']['en']['nama'],
                        'deskripsi' => ! empty($validated['translations']['en']['deskripsi'])
                            ? HtmlSanitizer::clean($validated['translations']['en']['deskripsi'])
                            : null,
                        'ai_translated' => false,
                        'reviewed' => true,
                    ]
                );
            }

            // Hapus media yang ditandai untuk dihapus
            if (! empty($validated['deleted_media_ids'])) {
                Media::whereIn('id', $validated['deleted_media_ids'])
                    ->where('model_id', $fasilitas->id)
                    ->where('model_type', Fasilitas::class)
                    ->get()
                    ->each(fn (Media $m) => $m->delete());
            }

            // Unggah media baru
            if ($request->hasFile('fotos')) {
                foreach ($request->file('fotos') as $file) {
                    $fasilitas->addMedia($file)->toMediaCollection('foto');
                }
            }
        });

        Cache::forget('public.fasilitas.id');
        Cache::forget('public.fasilitas.en');

        return redirect()->route('admin.fasilitas.index')->with('success', 'Fasilitas berhasil diperbarui.');
    }

    public function destroy(Fasilitas $fasilita)
    {
        $fasilitas = $fasilita;
        Gate::authorize('delete', $fasilitas);

        $fasilitas->clearMediaCollection('foto');
        $fasilitas->delete();

        Cache::forget('public.fasilitas.id');
        Cache::forget('public.fasilitas.en');

        return redirect()->route('admin.fasilitas.index')->with('success', 'Fasilitas berhasil dihapus.');
    }

    public function reorder(ReorderFasilitasRequest $request)
    {
        $validated = $request->validated();

        foreach ($validated['items'] as $item) {
            Fasilitas::where('id', $item['id'])->update(['urutan' => $item['urutan']]);
        }

        Cache::forget('public.fasilitas.id');
        Cache::forget('public.fasilitas.en');

        return back()->with('success', 'Urutan fasilitas berhasil diperbarui.');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUnduhanRequest;
use App\Http\Requests\Admin\UpdateUnduhanRequest;
use App\Http\Resources\Admin\UnduhanResource;
use App\Models\Unduhan;
use App\Services\HtmlSanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UnduhanController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Unduhan::class);

        $query = Unduhan::query()->with(['translations', 'media']);

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->input('kategori'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('translations', function ($qt) use ($search) {
                    $qt->where('judul', 'like', "%{$search}%");
                });
            });
        }

        $unduhan = $query->ordered()->paginate(15)->withQueryString()->through(function (Unduhan $item) {
            return (new UnduhanResource($item))->resolve();
        });

        return Inertia::render('Admin/Unduhan/Index', [
            'unduhan' => $unduhan,
            'filters' => $request->only(['kategori', 'search']),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Unduhan::class);

        return Inertia::render('Admin/Unduhan/Form', [
            'unduhan' => null,
        ]);
    }

    public function store(StoreUnduhanRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated) {
            $judulId = $validated['translations']['id']['judul'];

            /** @var Unduhan $unduhan */
            $unduhan = Unduhan::create([
                'slug' => Str::slug($judulId),
                'kategori' => $validated['kategori'],
                'tanggal_terbit' => $validated['tanggal_terbit'],
                'is_active' => $request->boolean('is_active', true),
            ]);

            $unduhan->translations()->create([
                'locale' => 'id',
                'judul' => $judulId,
                'deskripsi' => ! empty($validated['translations']['id']['deskripsi'])
                    ? HtmlSanitizer::clean($validated['translations']['id']['deskripsi'])
                    : null,
                'ai_translated' => false,
                'reviewed' => true,
            ]);

            if (! empty($validated['translations']['en']['judul'])) {
                $unduhan->translations()->create([
                    'locale' => 'en',
                    'judul' => $validated['translations']['en']['judul'],
                    'deskripsi' => ! empty($validated['translations']['en']['deskripsi'])
                        ? HtmlSanitizer::clean($validated['translations']['en']['deskripsi'])
                        : null,
                    'ai_translated' => false,
                    'reviewed' => true,
                ]);
            }

            if ($request->hasFile('berkas')) {
                // Disimpan di disk local (non-publik)
                $unduhan->addMediaFromRequest('berkas')->toMediaCollection('berkas', 'local');
            }
        });

        Cache::forget('public.unduhan.id');
        Cache::forget('public.unduhan.en');

        return redirect()->route('admin.unduhan.index')->with('success', 'Dokumen unduhan berhasil ditambahkan.');
    }

    public function edit(Unduhan $unduhan): Response
    {
        Gate::authorize('update', $unduhan);

        $unduhan->load(['translations', 'media']);

        return Inertia::render('Admin/Unduhan/Form', [
            'unduhan' => (new UnduhanResource($unduhan))->resolve(),
        ]);
    }

    public function update(UpdateUnduhanRequest $request, Unduhan $unduhan)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $unduhan, $validated) {
            $judulId = $validated['translations']['id']['judul'];

            $unduhan->update([
                'slug' => Str::slug($judulId),
                'kategori' => $validated['kategori'],
                'tanggal_terbit' => $validated['tanggal_terbit'],
                'is_active' => $request->boolean('is_active', true),
            ]);

            $unduhan->translations()->updateOrCreate(
                ['locale' => 'id'],
                [
                    'judul' => $judulId,
                    'deskripsi' => ! empty($validated['translations']['id']['deskripsi'])
                        ? HtmlSanitizer::clean($validated['translations']['id']['deskripsi'])
                        : null,
                ]
            );

            if (! empty($validated['translations']['en']['judul'])) {
                $unduhan->translations()->updateOrCreate(
                    ['locale' => 'en'],
                    [
                        'judul' => $validated['translations']['en']['judul'],
                        'deskripsi' => ! empty($validated['translations']['en']['deskripsi'])
                            ? HtmlSanitizer::clean($validated['translations']['en']['deskripsi'])
                            : null,
                    ]
                );
            } else {
                $unduhan->translations()->where('locale', 'en')->delete();
            }

            if ($request->hasFile('berkas')) {
                $unduhan->clearMediaCollection('berkas');
                $unduhan->addMediaFromRequest('berkas')->toMediaCollection('berkas', 'local');
            }
        });

        Cache::forget('public.unduhan.id');
        Cache::forget('public.unduhan.en');

        return redirect()->route('admin.unduhan.index')->with('success', 'Dokumen unduhan berhasil diperbarui.');
    }

    public function destroy(Unduhan $unduhan)
    {
        Gate::authorize('delete', $unduhan);

        $unduhan->clearMediaCollection('berkas');
        $unduhan->delete();

        Cache::forget('public.unduhan.id');
        Cache::forget('public.unduhan.en');

        return redirect()->route('admin.unduhan.index')->with('success', 'Dokumen unduhan berhasil dihapus.');
    }
}

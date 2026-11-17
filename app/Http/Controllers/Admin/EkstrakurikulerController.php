<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderEkstrakurikulerRequest;
use App\Http\Requests\Admin\StoreEkstrakurikulerRequest;
use App\Http\Requests\Admin\UpdateEkstrakurikulerRequest;
use App\Http\Resources\Admin\EkstrakurikulerResource;
use App\Models\Ekstrakurikuler;
use App\Models\Guru;
use App\Services\HtmlSanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EkstrakurikulerController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Ekstrakurikuler::class);

        $query = Ekstrakurikuler::query()->with(['translations', 'pembina', 'media']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('translations', function ($qt) use ($search) {
                    $qt->where('nama', 'like', "%{$search}%");
                });
            });
        }

        $ekskulList = $query->ordered()->paginate(15)->withQueryString()->through(function (Ekstrakurikuler $item) {
            return (new EkstrakurikulerResource($item))->resolve();
        });

        return Inertia::render('Admin/Ekstrakurikuler/Index', [
            'ekskulList' => $ekskulList,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Ekstrakurikuler::class);

        $gurus = Guru::query()->active()->ordered()->get()->map(function (Guru $g) {
            return [
                'id' => $g->id,
                'nama' => $g->nama_lengkap,
            ];
        });

        return Inertia::render('Admin/Ekstrakurikuler/Form', [
            'ekskul' => null,
            'gurus' => $gurus,
        ]);
    }

    public function store(StoreEkstrakurikulerRequest $request)
    {
        Gate::authorize('create', Ekstrakurikuler::class);

        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated) {
            $maxUrutan = Ekstrakurikuler::max('urutan') ?? 0;
            $namaId = $validated['translations']['id']['nama'];

            /** @var Ekstrakurikuler $ekskul */
            $ekskul = Ekstrakurikuler::create([
                'slug' => Str::slug($namaId),
                'pembina_guru_id' => $validated['pembina_guru_id'] ?? null,
                'urutan' => $validated['urutan'] ?? ($maxUrutan + 1),
                'is_active' => $request->boolean('is_active', true),
            ]);

            $ekskul->translations()->create([
                'locale' => 'id',
                'nama' => $namaId,
                'deskripsi' => ! empty($validated['translations']['id']['deskripsi'])
                    ? HtmlSanitizer::clean($validated['translations']['id']['deskripsi'])
                    : null,
                'jadwal' => $validated['translations']['id']['jadwal'] ?? null,
                'ai_translated' => false,
                'reviewed' => true,
            ]);

            if (! empty($validated['translations']['en']['nama'])) {
                $ekskul->translations()->create([
                    'locale' => 'en',
                    'nama' => $validated['translations']['en']['nama'],
                    'deskripsi' => ! empty($validated['translations']['en']['deskripsi'])
                        ? HtmlSanitizer::clean($validated['translations']['en']['deskripsi'])
                        : null,
                    'jadwal' => $validated['translations']['en']['jadwal'] ?? null,
                    'ai_translated' => false,
                    'reviewed' => true,
                ]);
            }

            if ($request->hasFile('foto')) {
                $alt = $request->input('foto_alt') ?: ('Foto ekstrakurikuler '.($validated['translations']['id']['nama'] ?? ''));
                $ekskul->addMediaFromRequest('foto')
                    ->withCustomProperties(['alt' => $alt])
                    ->toMediaCollection('foto');
            }
        });

        Cache::forget('public.ekskul.id');
        Cache::forget('public.ekskul.en');

        return redirect()->route('admin.ekstrakurikuler.index')->with('success', 'Ekstrakurikuler berhasil ditambahkan.');
    }

    public function edit(Ekstrakurikuler $ekstrakurikuler)
    {
        Gate::authorize('update', $ekstrakurikuler);

        $ekstrakurikuler->load(['translations', 'pembina', 'media']);

        $gurus = Guru::query()->active()->ordered()->get()->map(function (Guru $g) {
            return [
                'id' => $g->id,
                'nama' => $g->nama_lengkap,
            ];
        });

        return Inertia::render('Admin/Ekstrakurikuler/Form', [
            'ekskul' => (new EkstrakurikulerResource($ekstrakurikuler))->resolve(),
            'gurus' => $gurus,
        ]);
    }

    public function update(UpdateEkstrakurikulerRequest $request, Ekstrakurikuler $ekstrakurikuler)
    {
        Gate::authorize('update', $ekstrakurikuler);

        $validated = $request->validated();

        DB::transaction(function () use ($request, $ekstrakurikuler, $validated) {
            $namaId = $validated['translations']['id']['nama'];

            $ekstrakurikuler->update([
                'slug' => Str::slug($namaId),
                'pembina_guru_id' => $validated['pembina_guru_id'] ?? null,
                'urutan' => $validated['urutan'] ?? $ekstrakurikuler->urutan,
                'is_active' => $request->boolean('is_active', $ekstrakurikuler->is_active),
            ]);

            $ekstrakurikuler->translations()->updateOrCreate(
                ['locale' => 'id'],
                [
                    'nama' => $namaId,
                    'deskripsi' => ! empty($validated['translations']['id']['deskripsi'])
                        ? HtmlSanitizer::clean($validated['translations']['id']['deskripsi'])
                        : null,
                    'jadwal' => $validated['translations']['id']['jadwal'] ?? null,
                    'ai_translated' => false,
                    'reviewed' => true,
                ]
            );

            if (! empty($validated['translations']['en']['nama'])) {
                $ekstrakurikuler->translations()->updateOrCreate(
                    ['locale' => 'en'],
                    [
                        'nama' => $validated['translations']['en']['nama'],
                        'deskripsi' => ! empty($validated['translations']['en']['deskripsi'])
                            ? HtmlSanitizer::clean($validated['translations']['en']['deskripsi'])
                            : null,
                        'jadwal' => $validated['translations']['en']['jadwal'] ?? null,
                        'ai_translated' => false,
                        'reviewed' => true,
                    ]
                );
            }

            if ($request->boolean('hapus_foto')) {
                $ekstrakurikuler->clearMediaCollection('foto');
            } elseif ($request->hasFile('foto')) {
                $alt = $request->input('foto_alt') ?: ('Foto ekstrakurikuler '.($validated['translations']['id']['nama'] ?? ''));
                $ekstrakurikuler->addMediaFromRequest('foto')
                    ->withCustomProperties(['alt' => $alt])
                    ->toMediaCollection('foto');
            }
        });

        Cache::forget('public.ekskul.id');
        Cache::forget('public.ekskul.en');

        return redirect()->route('admin.ekstrakurikuler.index')->with('success', 'Ekstrakurikuler berhasil diperbarui.');
    }

    public function destroy(Ekstrakurikuler $ekstrakurikuler)
    {
        Gate::authorize('delete', $ekstrakurikuler);

        $ekstrakurikuler->delete();

        Cache::forget('public.ekskul.id');
        Cache::forget('public.ekskul.en');

        return redirect()->route('admin.ekstrakurikuler.index')->with('success', 'Ekstrakurikuler berhasil dihapus.');
    }

    public function reorder(ReorderEkstrakurikulerRequest $request)
    {
        Gate::authorize('reorder', Ekstrakurikuler::class);

        $items = $request->validated('items');

        DB::transaction(function () use ($items) {
            foreach ($items as $item) {
                Ekstrakurikuler::where('id', $item['id'])->update(['urutan' => $item['urutan']]);
            }
        });

        Cache::forget('public.ekskul.id');
        Cache::forget('public.ekskul.en');

        return back()->with('success', 'Urutan ekstrakurikuler berhasil diperbarui.');
    }
}

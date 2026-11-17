<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTestimoniRequest;
use App\Http\Requests\Admin\UpdateTestimoniRequest;
use App\Http\Resources\Admin\TestimoniResource;
use App\Models\Testimoni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TestimoniController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Testimoni::class);

        $query = Testimoni::query()->with(['translations', 'media']);

        if ($request->filled('peran')) {
            $query->where('peran', $request->input('peran'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('keterangan', 'like', "%{$search}%")
                    ->orWhereHas('translations', function ($qt) use ($search) {
                        $qt->where('kutipan', 'like', "%{$search}%");
                    });
            });
        }

        $testimoni = $query->ordered()->paginate(15)->withQueryString()->through(function (Testimoni $item) {
            return (new TestimoniResource($item))->resolve();
        });

        return Inertia::render('Admin/Testimoni/Index', [
            'testimoni' => $testimoni,
            'filters' => $request->only(['peran', 'search']),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Testimoni::class);

        return Inertia::render('Admin/Testimoni/Form', [
            'testimoni' => null,
        ]);
    }

    public function store(StoreTestimoniRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated) {
            $maxUrutan = Testimoni::max('urutan') ?? 0;

            /** @var Testimoni $testimoni */
            $testimoni = Testimoni::create([
                'nama' => $validated['nama'],
                'peran' => $validated['peran'],
                'keterangan' => $validated['keterangan'],
                'persetujuan_tampil' => $request->boolean('persetujuan_tampil'),
                'is_active' => $request->boolean('is_active', true),
                'urutan' => $validated['urutan'] ?? ($maxUrutan + 1),
            ]);

            $testimoni->translations()->create([
                'locale' => 'id',
                'kutipan' => $validated['translations']['id']['kutipan'],
                'ai_translated' => false,
                'reviewed' => true,
            ]);

            if (! empty($validated['translations']['en']['kutipan'])) {
                $testimoni->translations()->create([
                    'locale' => 'en',
                    'kutipan' => $validated['translations']['en']['kutipan'],
                    'ai_translated' => false,
                    'reviewed' => true,
                ]);
            }

            if ($request->hasFile('foto')) {
                $alt = $request->input('foto_alt') ?: ('Foto testimoni '.$testimoni->nama);
                $testimoni->addMediaFromRequest('foto')
                    ->withCustomProperties(['alt' => $alt])
                    ->toMediaCollection('foto');
            }
        });

        Cache::forget('public.testimoni.id');
        Cache::forget('public.testimoni.en');

        return redirect()->route('admin.testimoni.index')->with('success', 'Testimoni berhasil ditambahkan.');
    }

    public function edit(Testimoni $testimoni): Response
    {
        Gate::authorize('update', $testimoni);

        $testimoni->load(['translations', 'media']);

        return Inertia::render('Admin/Testimoni/Form', [
            'testimoni' => (new TestimoniResource($testimoni))->resolve(),
        ]);
    }

    public function update(UpdateTestimoniRequest $request, Testimoni $testimoni)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $testimoni, $validated) {
            $testimoni->update([
                'nama' => $validated['nama'],
                'peran' => $validated['peran'],
                'keterangan' => $validated['keterangan'],
                'persetujuan_tampil' => $request->boolean('persetujuan_tampil'),
                'is_active' => $request->boolean('is_active', true),
                'urutan' => $validated['urutan'] ?? $testimoni->urutan,
            ]);

            $testimoni->translations()->updateOrCreate(
                ['locale' => 'id'],
                ['kutipan' => $validated['translations']['id']['kutipan']]
            );

            if (! empty($validated['translations']['en']['kutipan'])) {
                $testimoni->translations()->updateOrCreate(
                    ['locale' => 'en'],
                    ['kutipan' => $validated['translations']['en']['kutipan']]
                );
            } else {
                $testimoni->translations()->where('locale', 'en')->delete();
            }

            if ($request->boolean('hapus_foto')) {
                $testimoni->clearMediaCollection('foto');
            } elseif ($request->hasFile('foto')) {
                $alt = $request->input('foto_alt') ?: ('Foto testimoni '.$testimoni->nama);
                $testimoni->clearMediaCollection('foto');
                $testimoni->addMediaFromRequest('foto')
                    ->withCustomProperties(['alt' => $alt])
                    ->toMediaCollection('foto');
            }
        });

        Cache::forget('public.testimoni.id');
        Cache::forget('public.testimoni.en');

        return redirect()->route('admin.testimoni.index')->with('success', 'Testimoni berhasil diperbarui.');
    }

    public function destroy(Testimoni $testimoni)
    {
        Gate::authorize('delete', $testimoni);

        $testimoni->clearMediaCollection('foto');
        $testimoni->delete();

        Cache::forget('public.testimoni.id');
        Cache::forget('public.testimoni.en');

        return redirect()->route('admin.testimoni.index')->with('success', 'Testimoni berhasil dihapus.');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderGuruRequest;
use App\Http\Requests\Admin\StoreGuruRequest;
use App\Http\Requests\Admin\UpdateGuruRequest;
use App\Http\Resources\Admin\GuruResource;
use App\Models\Guru;
use App\Models\Jurusan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class GuruController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Guru::class);

        $query = Guru::query()->with(['translations', 'jurusan.translations', 'media']);

        if ($request->filled('kelompok')) {
            $query->where('kelompok', $request->input('kelompok'));
        }

        if ($request->filled('jurusan_id')) {
            $query->where('jurusan_id', $request->input('jurusan_id'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhereHas('translations', function ($qt) use ($search) {
                        $qt->where('jabatan', 'like', "%{$search}%")
                            ->orWhere('mapel', 'like', "%{$search}%");
                    });
            });
        }

        $guruList = $query->ordered()->paginate(15)->withQueryString()->through(function (Guru $guru) {
            return (new GuruResource($guru))->resolve();
        });

        $jurusans = Jurusan::ordered()->with('translations')->get()->map(function (Jurusan $j) {
            $trans = $j->translation();

            return [
                'id' => $j->id,
                'nama' => $trans ? $trans->nama : $j->kode,
            ];
        });

        return Inertia::render('Admin/Guru/Index', [
            'guruList' => $guruList,
            'jurusans' => $jurusans,
            'filters' => $request->only(['kelompok', 'jurusan_id', 'search']),
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Guru::class);

        $jurusans = Jurusan::ordered()->with('translations')->get()->map(function (Jurusan $j) {
            $trans = $j->translation();

            return [
                'id' => $j->id,
                'nama' => $trans ? $trans->nama : $j->kode,
            ];
        });

        return Inertia::render('Admin/Guru/Form', [
            'guru' => null,
            'jurusans' => $jurusans,
        ]);
    }

    public function store(StoreGuruRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated) {
            $maxUrutan = Guru::where('kelompok', $validated['kelompok'])->max('urutan') ?? 0;

            /** @var Guru $guru */
            $guru = Guru::create([
                'nama' => $validated['nama'],
                'gelar_depan' => $validated['gelar_depan'] ?? null,
                'gelar_belakang' => $validated['gelar_belakang'] ?? null,
                'kelompok' => $validated['kelompok'],
                'jurusan_id' => $validated['jurusan_id'] ?? null,
                'urutan' => $validated['urutan'] ?? ($maxUrutan + 1),
                'is_active' => $request->boolean('is_active', true),
            ]);

            // Simpan translasi ID
            $guru->translations()->create([
                'locale' => 'id',
                'jabatan' => $validated['translations']['id']['jabatan'],
                'mapel' => $validated['translations']['id']['mapel'] ?? null,
                'ai_translated' => false,
                'reviewed' => true,
            ]);

            // Simpan translasi EN bila diisi
            if (! empty($validated['translations']['en']['jabatan'])) {
                $guru->translations()->create([
                    'locale' => 'en',
                    'jabatan' => $validated['translations']['en']['jabatan'],
                    'mapel' => $validated['translations']['en']['mapel'] ?? null,
                    'ai_translated' => false,
                    'reviewed' => true,
                ]);
            }

            if ($request->hasFile('foto')) {
                $alt = $request->input('foto_alt') ?: ('Foto '.$guru->nama);
                $guru->addMediaFromRequest('foto')
                    ->withCustomProperties(['alt' => $alt])
                    ->toMediaCollection('foto');
            }
        });

        Cache::forget('public.guru.id');
        Cache::forget('public.guru.en');

        return redirect()->route('admin.guru.index')->with('success', 'Data guru/tendik berhasil ditambahkan.');
    }

    public function edit(Guru $guru)
    {
        Gate::authorize('update', $guru);

        $guru->load(['translations', 'jurusan.translations', 'media']);

        $jurusans = Jurusan::ordered()->with('translations')->get()->map(function (Jurusan $j) {
            $trans = $j->translation();

            return [
                'id' => $j->id,
                'nama' => $trans ? $trans->nama : $j->kode,
            ];
        });

        return Inertia::render('Admin/Guru/Form', [
            'guru' => (new GuruResource($guru))->resolve(),
            'jurusans' => $jurusans,
        ]);
    }

    public function update(UpdateGuruRequest $request, Guru $guru)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $guru, $validated) {
            $guru->update([
                'nama' => $validated['nama'],
                'gelar_depan' => $validated['gelar_depan'] ?? null,
                'gelar_belakang' => $validated['gelar_belakang'] ?? null,
                'kelompok' => $validated['kelompok'],
                'jurusan_id' => $validated['jurusan_id'] ?? null,
                'urutan' => $validated['urutan'] ?? $guru->urutan,
                'is_active' => $request->boolean('is_active', $guru->is_active),
            ]);

            $guru->translations()->updateOrCreate(
                ['locale' => 'id'],
                [
                    'jabatan' => $validated['translations']['id']['jabatan'],
                    'mapel' => $validated['translations']['id']['mapel'] ?? null,
                    'ai_translated' => false,
                    'reviewed' => true,
                ]
            );

            if (! empty($validated['translations']['en']['jabatan'])) {
                $guru->translations()->updateOrCreate(
                    ['locale' => 'en'],
                    [
                        'jabatan' => $validated['translations']['en']['jabatan'],
                        'mapel' => $validated['translations']['en']['mapel'] ?? null,
                        'ai_translated' => false,
                        'reviewed' => true,
                    ]
                );
            }

            if ($request->hasFile('foto')) {
                $alt = $request->input('foto_alt') ?: ('Foto '.$guru->nama);
                $guru->addMediaFromRequest('foto')
                    ->withCustomProperties(['alt' => $alt])
                    ->toMediaCollection('foto');
            } elseif ($request->boolean('remove_foto')) {
                $guru->clearMediaCollection('foto');
            }
        });

        Cache::forget('public.guru.id');
        Cache::forget('public.guru.en');

        return redirect()->route('admin.guru.index')->with('success', 'Data guru/tendik berhasil diperbarui.');
    }

    public function destroy(Guru $guru)
    {
        Gate::authorize('delete', $guru);

        $guru->clearMediaCollection('foto');
        $guru->delete();

        Cache::forget('public.guru.id');
        Cache::forget('public.guru.en');

        return redirect()->route('admin.guru.index')->with('success', 'Data guru/tendik berhasil dihapus.');
    }

    public function reorder(ReorderGuruRequest $request)
    {
        $validated = $request->validated();

        foreach ($validated['items'] as $item) {
            Guru::where('id', $item['id'])->update(['urutan' => $item['urutan']]);
        }

        Cache::forget('public.guru.id');
        Cache::forget('public.guru.en');

        return back()->with('success', 'Urutan guru/tendik berhasil diperbarui.');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePrestasiRequest;
use App\Http\Requests\Admin\UpdatePrestasiRequest;
use App\Http\Resources\Admin\PrestasiResource;
use App\Models\Jurusan;
use App\Models\Prestasi;
use App\Services\HtmlSanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PrestasiController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Prestasi::class);

        $query = Prestasi::query()->with(['translations', 'jurusan.translations', 'media']);

        if ($request->filled('tingkat')) {
            $query->where('tingkat', $request->input('tingkat'));
        }

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->input('kategori'));
        }

        if ($request->filled('tahun')) {
            $query->where('tahun', $request->input('tahun'));
        }

        if ($request->filled('jurusan_id')) {
            $query->where('jurusan_id', $request->input('jurusan_id'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('translations', function ($qt) use ($search) {
                    $qt->where('judul', 'like', "%{$search}%");
                });
            });
        }

        $prestasiList = $query->ordered()->paginate(15)->withQueryString()->through(function (Prestasi $item) {
            return (new PrestasiResource($item))->resolve();
        });

        $jurusans = Jurusan::ordered()->with('translations')->get()->map(function (Jurusan $j) {
            $trans = $j->translation('id');

            return [
                'id' => $j->id,
                'nama' => $trans ? $trans->nama : $j->kode,
            ];
        });

        $years = Prestasi::query()->select('tahun')->distinct()->orderByDesc('tahun')->pluck('tahun');

        return Inertia::render('Admin/Prestasi/Index', [
            'prestasiList' => $prestasiList,
            'jurusans' => $jurusans,
            'years' => $years,
            'filters' => $request->only(['tingkat', 'kategori', 'tahun', 'jurusan_id', 'search']),
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Prestasi::class);

        $jurusans = Jurusan::ordered()->with('translations')->get()->map(function (Jurusan $j) {
            $trans = $j->translation('id');

            return [
                'id' => $j->id,
                'nama' => $trans ? $trans->nama : $j->kode,
            ];
        });

        return Inertia::render('Admin/Prestasi/Form', [
            'prestasi' => null,
            'jurusans' => $jurusans,
        ]);
    }

    public function store(StorePrestasiRequest $request)
    {
        Gate::authorize('create', Prestasi::class);

        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated) {
            $judulId = $validated['translations']['id']['judul'];

            /** @var Prestasi $prestasi */
            $prestasi = Prestasi::create([
                'slug' => Str::slug($judulId),
                'tingkat' => $validated['tingkat'],
                'kategori' => $validated['kategori'],
                'tahun' => $validated['tahun'],
                'tanggal' => $validated['tanggal'] ?? null,
                'jurusan_id' => $validated['jurusan_id'] ?? null,
                'is_active' => $request->boolean('is_active', true),
            ]);

            $prestasi->translations()->create([
                'locale' => 'id',
                'judul' => $judulId,
                'ringkasan' => ! empty($validated['translations']['id']['ringkasan'])
                    ? HtmlSanitizer::clean($validated['translations']['id']['ringkasan'])
                    : null,
                'ai_translated' => false,
                'reviewed' => true,
            ]);

            if (! empty($validated['translations']['en']['judul'])) {
                $prestasi->translations()->create([
                    'locale' => 'en',
                    'judul' => $validated['translations']['en']['judul'],
                    'ringkasan' => ! empty($validated['translations']['en']['ringkasan'])
                        ? HtmlSanitizer::clean($validated['translations']['en']['ringkasan'])
                        : null,
                    'ai_translated' => false,
                    'reviewed' => true,
                ]);
            }

            if ($request->hasFile('foto')) {
                $prestasi->addMediaFromRequest('foto')->toMediaCollection('foto');
            }
        });

        Cache::forget('public.prestasi.id');
        Cache::forget('public.prestasi.en');
        Cache::forget('beranda.prestasi.id');
        Cache::forget('beranda.prestasi.en');

        return redirect()->route('admin.prestasi.index')->with('success', 'Prestasi berhasil ditambahkan.');
    }

    public function edit(Prestasi $prestasi)
    {
        Gate::authorize('update', $prestasi);

        $prestasi->load(['translations', 'jurusan.translations', 'media']);

        $jurusans = Jurusan::ordered()->with('translations')->get()->map(function (Jurusan $j) {
            $trans = $j->translation('id');

            return [
                'id' => $j->id,
                'nama' => $trans ? $trans->nama : $j->kode,
            ];
        });

        return Inertia::render('Admin/Prestasi/Form', [
            'prestasi' => (new PrestasiResource($prestasi))->resolve(),
            'jurusans' => $jurusans,
        ]);
    }

    public function update(UpdatePrestasiRequest $request, Prestasi $prestasi)
    {
        Gate::authorize('update', $prestasi);

        $validated = $request->validated();

        DB::transaction(function () use ($request, $prestasi, $validated) {
            $judulId = $validated['translations']['id']['judul'];

            $prestasi->update([
                'slug' => Str::slug($judulId),
                'tingkat' => $validated['tingkat'],
                'kategori' => $validated['kategori'],
                'tahun' => $validated['tahun'],
                'tanggal' => $validated['tanggal'] ?? null,
                'jurusan_id' => $validated['jurusan_id'] ?? null,
                'is_active' => $request->boolean('is_active', $prestasi->is_active),
            ]);

            $prestasi->translations()->updateOrCreate(
                ['locale' => 'id'],
                [
                    'judul' => $judulId,
                    'ringkasan' => ! empty($validated['translations']['id']['ringkasan'])
                        ? HtmlSanitizer::clean($validated['translations']['id']['ringkasan'])
                        : null,
                    'ai_translated' => false,
                    'reviewed' => true,
                ]
            );

            if (! empty($validated['translations']['en']['judul'])) {
                $prestasi->translations()->updateOrCreate(
                    ['locale' => 'en'],
                    [
                        'judul' => $validated['translations']['en']['judul'],
                        'ringkasan' => ! empty($validated['translations']['en']['ringkasan'])
                            ? HtmlSanitizer::clean($validated['translations']['en']['ringkasan'])
                            : null,
                        'ai_translated' => false,
                        'reviewed' => true,
                    ]
                );
            }

            if ($request->boolean('hapus_foto')) {
                $prestasi->clearMediaCollection('foto');
            } elseif ($request->hasFile('foto')) {
                $prestasi->addMediaFromRequest('foto')->toMediaCollection('foto');
            }
        });

        Cache::forget('public.prestasi.id');
        Cache::forget('public.prestasi.en');
        Cache::forget('beranda.prestasi.id');
        Cache::forget('beranda.prestasi.en');

        return redirect()->route('admin.prestasi.index')->with('success', 'Prestasi berhasil diperbarui.');
    }

    public function destroy(Prestasi $prestasi)
    {
        Gate::authorize('delete', $prestasi);

        $prestasi->delete();

        Cache::forget('public.prestasi.id');
        Cache::forget('public.prestasi.en');
        Cache::forget('beranda.prestasi.id');
        Cache::forget('beranda.prestasi.en');

        return redirect()->route('admin.prestasi.index')->with('success', 'Prestasi berhasil dihapus.');
    }
}

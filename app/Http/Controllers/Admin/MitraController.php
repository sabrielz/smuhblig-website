<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderMitraRequest;
use App\Http\Requests\Admin\StoreMitraRequest;
use App\Http\Requests\Admin\UpdateMitraRequest;
use App\Http\Resources\Admin\MitraResource;
use App\Models\Jurusan;
use App\Models\Mitra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MitraController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Mitra::class);

        $query = Mitra::query()->with(['jurusans.translations', 'media']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('bidang', 'like', "%{$search}%");
            });
        }

        $mitras = $query->ordered()->paginate(20)->withQueryString()->through(function (Mitra $item) {
            return (new MitraResource($item))->resolve();
        });

        return Inertia::render('Admin/Mitra/Index', [
            'mitras' => $mitras,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Mitra::class);

        $jurusans = Jurusan::active()->ordered()->with('translations')->get()->map(function ($j) {
            $trans = $j->translation();

            return [
                'id' => $j->id,
                'kode' => $j->kode,
                'nama' => $trans ? $trans->nama : $j->kode,
            ];
        });

        return Inertia::render('Admin/Mitra/Form', [
            'mitra' => null,
            'jurusans' => $jurusans,
        ]);
    }

    public function store(StoreMitraRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated) {
            $maxUrutan = Mitra::max('urutan') ?? 0;

            /** @var Mitra $mitra */
            $mitra = Mitra::create([
                'nama' => $validated['nama'],
                'bidang' => $validated['bidang'],
                'url' => $validated['url'] ?? null,
                'urutan' => $validated['urutan'] ?? ($maxUrutan + 1),
                'is_active' => $request->boolean('is_active', true),
            ]);

            if (! empty($validated['jurusan_ids'])) {
                $mitra->jurusans()->sync($validated['jurusan_ids']);
            }

            if ($request->hasFile('logo')) {
                $alt = $request->input('logo_alt') ?: ('Logo '.$mitra->nama);
                $mitra->addMediaFromRequest('logo')
                    ->withCustomProperties(['alt' => $alt])
                    ->toMediaCollection('logo');
            }
        });

        Cache::forget('public.mitra.all');

        return redirect()->route('admin.mitra.index')->with('success', 'Mitra industri berhasil ditambahkan.');
    }

    public function edit(Mitra $mitra): Response
    {
        Gate::authorize('update', $mitra);

        $mitra->load(['jurusans.translations', 'media']);

        $jurusans = Jurusan::active()->ordered()->with('translations')->get()->map(function ($j) {
            $trans = $j->translation();

            return [
                'id' => $j->id,
                'kode' => $j->kode,
                'nama' => $trans ? $trans->nama : $j->kode,
            ];
        });

        return Inertia::render('Admin/Mitra/Form', [
            'mitra' => (new MitraResource($mitra))->resolve(),
            'jurusans' => $jurusans,
        ]);
    }

    public function update(UpdateMitraRequest $request, Mitra $mitra)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $mitra, $validated) {
            $mitra->update([
                'nama' => $validated['nama'],
                'bidang' => $validated['bidang'],
                'url' => $validated['url'] ?? null,
                'urutan' => $validated['urutan'] ?? $mitra->urutan,
                'is_active' => $request->boolean('is_active', true),
            ]);

            $mitra->jurusans()->sync($validated['jurusan_ids'] ?? []);

            if ($request->boolean('hapus_logo')) {
                $mitra->clearMediaCollection('logo');
            } elseif ($request->hasFile('logo')) {
                $alt = $request->input('logo_alt') ?: ('Logo '.$mitra->nama);
                $mitra->clearMediaCollection('logo');
                $mitra->addMediaFromRequest('logo')
                    ->withCustomProperties(['alt' => $alt])
                    ->toMediaCollection('logo');
            }
        });

        Cache::forget('public.mitra.all');

        return redirect()->route('admin.mitra.index')->with('success', 'Mitra industri berhasil diperbarui.');
    }

    public function destroy(Mitra $mitra)
    {
        Gate::authorize('delete', $mitra);

        $mitra->clearMediaCollection('logo');
        $mitra->jurusans()->detach();
        $mitra->delete();

        Cache::forget('public.mitra.all');

        return redirect()->route('admin.mitra.index')->with('success', 'Mitra industri berhasil dihapus.');
    }

    public function reorder(ReorderMitraRequest $request)
    {
        Gate::authorize('update', Mitra::class);

        $orders = $request->validated()['orders'];

        DB::transaction(function () use ($orders) {
            foreach ($orders as $order) {
                Mitra::where('id', $order['id'])->update(['urutan' => $order['urutan']]);
            }
        });

        Cache::forget('public.mitra.all');

        return back()->with('success', 'Urutan mitra industri berhasil diperbarui.');
    }
}

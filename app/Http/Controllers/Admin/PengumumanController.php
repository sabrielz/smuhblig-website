<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePengumumanRequest;
use App\Http\Requests\Admin\UpdatePengumumanRequest;
use App\Http\Resources\Admin\PengumumanResource;
use App\Http\Resources\Public\PengumumanResource as PublicPengumumanResource;
use App\Models\Pengumuman;
use App\Services\HtmlSanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PengumumanController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Pengumuman::class);

        $query = Pengumuman::with('translations')->latest();

        if ($request->filled('status')) {
            $status = $request->input('status');
            $today = Carbon::today();
            if ($status === 'aktif') {
                $query->active();
            } elseif ($status === 'kadaluarsa') {
                $query->where(function ($q) use ($today) {
                    $q->where('is_active', false)
                        ->orWhere('tanggal_selesai', '<', $today);
                });
            }
        }

        $pengumumans = $query->paginate(10)->through(function ($p) {
            return (new PengumumanResource($p))->resolve();
        });

        return Inertia::render('Admin/Pengumuman/Index', [
            'pengumumans' => $pengumumans,
            'filters' => $request->only('status'),
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Pengumuman::class);

        return Inertia::render('Admin/Pengumuman/Form', [
            'pengumuman' => null,
        ]);
    }

    public function store(StorePengumumanRequest $request)
    {
        Gate::authorize('create', Pengumuman::class);

        $validated = $request->validated();

        $pengumuman = Pengumuman::create([
            'user_id' => request()->user()?->id ?? 1, // Fallback safely
            'slug' => Str::slug($validated['judul_id']),
            'tipe' => $validated['tipe'],
            'tanggal_mulai' => $validated['tanggal_mulai'] ? Carbon::parse($validated['tanggal_mulai']) : null,
            'tanggal_selesai' => $validated['tanggal_selesai'] ? Carbon::parse($validated['tanggal_selesai']) : null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $pengumuman->translations()->createMany([
            [
                'locale' => 'id',
                'judul' => $validated['judul_id'],
                'konten' => HtmlSanitizer::clean($validated['konten_id'] ?? ''),
            ],
            [
                'locale' => 'en',
                'judul' => $validated['judul_en'] ?? $validated['judul_id'],
                'konten' => HtmlSanitizer::clean($validated['konten_en'] ?? $validated['konten_id'] ?? ''),
            ],
        ]);

        return redirect()->route('admin.pengumuman.index')
            ->with('success', 'Pengumuman berhasil dibuat.');
    }

    public function edit(Pengumuman $pengumuman)
    {
        Gate::authorize('update', $pengumuman);

        $pengumuman->load('translations');

        return Inertia::render('Admin/Pengumuman/Form', [
            'pengumuman' => [
                'id' => $pengumuman->id,
                'judul_id' => $pengumuman->translation('id')?->judul,
                'judul_en' => $pengumuman->translation('en')?->judul,
                'konten_id' => $pengumuman->translation('id')?->konten,
                'konten_en' => $pengumuman->translation('en')?->konten,
                'tipe' => $pengumuman->tipe,
                'tanggal_mulai' => $pengumuman->tanggal_mulai?->format('Y-m-d'),
                'tanggal_selesai' => $pengumuman->tanggal_selesai?->format('Y-m-d'),
                'is_active' => $pengumuman->is_active,
            ],
        ]);
    }

    public function update(UpdatePengumumanRequest $request, Pengumuman $pengumuman)
    {
        Gate::authorize('update', $pengumuman);

        $validated = $request->validated();

        $pengumuman->update([
            'tipe' => $validated['tipe'],
            'tanggal_mulai' => $validated['tanggal_mulai'] ? Carbon::parse($validated['tanggal_mulai']) : null,
            'tanggal_selesai' => $validated['tanggal_selesai'] ? Carbon::parse($validated['tanggal_selesai']) : null,
            'is_active' => $validated['is_active'] ?? $pengumuman->is_active,
            'slug' => Str::slug($validated['judul_id']),
        ]);

        $pengumuman->translations()->where('locale', 'id')->update([
            'judul' => $validated['judul_id'],
            'konten' => HtmlSanitizer::clean($validated['konten_id'] ?? ''),
        ]);

        $pengumuman->translations()->updateOrCreate(
            ['locale' => 'en'],
            [
                'judul' => $validated['judul_en'] ?? $validated['judul_id'],
                'konten' => HtmlSanitizer::clean($validated['konten_en'] ?? $validated['konten_id'] ?? ''),
            ]
        );

        return redirect()->route('admin.pengumuman.index')
            ->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function destroy(Pengumuman $pengumuman)
    {
        Gate::authorize('delete', $pengumuman);

        $pengumuman->delete();

        return redirect()->route('admin.pengumuman.index')
            ->with('success', 'Pengumuman berhasil dihapus.');
    }

    /**
     * Preview announcement draft with public view layout.
     */
    public function preview(Pengumuman $pengumuman)
    {
        Gate::authorize('update', $pengumuman);

        $pengumuman->load('translations');

        return Inertia::render('Public/Pengumuman/Show', [
            'pengumuman' => (new PublicPengumumanResource($pengumuman))->resolve(),
            'isPreview' => true,
        ]);
    }
}

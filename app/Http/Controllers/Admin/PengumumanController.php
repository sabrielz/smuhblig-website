<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pengumuman;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class PengumumanController extends Controller
{
    public function index(Request $request)
    {
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
            $today = Carbon::today();
            $isExpired = $p->tanggal_selesai && $p->tanggal_selesai->lt($today);
            $isActive = $p->is_active && !$isExpired;

            return [
                'id' => $p->id,
                'judul' => $p->translation('id')?->judul ?? '-',
                'tipe' => $p->tipe,
                'tanggal_mulai' => $p->tanggal_mulai?->format('Y-m-d'),
                'tanggal_selesai' => $p->tanggal_selesai?->format('Y-m-d'),
                'is_active' => $isActive,
                'status_label' => $isActive ? 'Aktif' : ($isExpired ? 'Kadaluarsa' : 'Tidak Aktif'),
            ];
        });

        return Inertia::render('Admin/Pengumuman/Index', [
            'pengumumans' => $pengumumans,
            'filters' => $request->only('status'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Pengumuman/Form', [
            'pengumuman' => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul_id' => 'required|string|max:255',
            'judul_en' => 'nullable|string|max:255',
            'konten_id' => 'nullable|string',
            'konten_en' => 'nullable|string',
            'tipe' => 'required|in:info,penting,urgent',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'is_active' => 'boolean',
        ]);

        $pengumuman = Pengumuman::create([
            'user_id' => request()->user()?->id ?? 1, // Fallback safely
            'slug' => \Illuminate\Support\Str::slug($validated['judul_id']),
            'tipe' => $validated['tipe'],
            'tanggal_mulai' => $validated['tanggal_mulai'] ? Carbon::parse($validated['tanggal_mulai']) : null,
            'tanggal_selesai' => $validated['tanggal_selesai'] ? Carbon::parse($validated['tanggal_selesai']) : null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $pengumuman->translations()->createMany([
            [
                'locale' => 'id',
                'judul' => $validated['judul_id'],
                'konten' => $validated['konten_id'],
            ],
            [
                'locale' => 'en',
                'judul' => $validated['judul_en'] ?? $validated['judul_id'],
                'konten' => $validated['konten_en'] ?? $validated['konten_id'],
            ]
        ]);

        return redirect()->route('admin.pengumuman.index')
            ->with('success', 'Pengumuman berhasil dibuat.');
    }

    public function edit(Pengumuman $pengumuman)
    {
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

    public function update(Request $request, Pengumuman $pengumuman)
    {
        $validated = $request->validate([
            'judul_id' => 'required|string|max:255',
            'judul_en' => 'nullable|string|max:255',
            'konten_id' => 'nullable|string',
            'konten_en' => 'nullable|string',
            'tipe' => 'required|in:info,penting,urgent',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'is_active' => 'boolean',
        ]);

        $pengumuman->update([
            'tipe' => $validated['tipe'],
            'tanggal_mulai' => $validated['tanggal_mulai'] ? Carbon::parse($validated['tanggal_mulai']) : null,
            'tanggal_selesai' => $validated['tanggal_selesai'] ? Carbon::parse($validated['tanggal_selesai']) : null,
            'is_active' => $validated['is_active'] ?? $pengumuman->is_active,
            'slug' => \Illuminate\Support\Str::slug($validated['judul_id']),
        ]);

        $pengumuman->translations()->where('locale', 'id')->update([
            'judul' => $validated['judul_id'],
            'konten' => $validated['konten_id'],
        ]);

        $pengumuman->translations()->updateOrCreate(
            ['locale' => 'en'],
            [
                'judul' => $validated['judul_en'] ?? $validated['judul_id'],
                'konten' => $validated['konten_en'] ?? $validated['konten_id'],
            ]
        );

        return redirect()->route('admin.pengumuman.index')
            ->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function destroy(Pengumuman $pengumuman)
    {
        $pengumuman->delete();

        return redirect()->route('admin.pengumuman.index')
            ->with('success', 'Pengumuman berhasil dihapus.');
    }
}

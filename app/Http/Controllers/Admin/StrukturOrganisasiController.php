<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StrukturOrganisasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class StrukturOrganisasiController extends Controller
{
    public function index()
    {
        $struktur = StrukturOrganisasi::with(['children.children', 'media'])
            ->whereNull('parent_id')
            ->orderBy('urutan')
            ->get()
            ->map(function ($node) {
                return $this->formatNode($node);
            });

        $allNodes = StrukturOrganisasi::active()
            ->orderBy('nama')
            ->select('id', 'nama', 'jabatan', 'level', 'parent_id')
            ->get();

        return Inertia::render('Admin/StrukturOrganisasi/Index', [
            'strukturTree' => $struktur,
            'allNodes' => $allNodes,
        ]);
    }

    private function formatNode($node)
    {
        $data = $node->toArray();
        $data['foto_url'] = $node->getFirstMediaUrl('foto');
        if (isset($data['children']) && is_array($data['children'])) {
            $data['children'] = collect($node->children)->sortBy('urutan')->map(function ($child) {
                return $this->formatNode($child);
            })->values()->toArray();
        }
        return $data;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:struktur_organisasis,id',
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'jabatan_en' => 'nullable|string|max:255',
            'level' => 'required|integer|in:0,1,2',
            'is_active' => 'boolean',
            'foto' => 'nullable|image|max:2048',
        ]);

        $maxUrutan = StrukturOrganisasi::where('parent_id', $validated['parent_id'])->max('urutan') ?? 0;

        $struktur = StrukturOrganisasi::create([
            'parent_id' => $validated['parent_id'],
            'nama' => $validated['nama'],
            'jabatan' => $validated['jabatan'],
            'jabatan_en' => $validated['jabatan_en'] ?? null,
            'level' => $validated['level'],
            'is_active' => $request->has('is_active') ? $validated['is_active'] : true,
            'urutan' => $maxUrutan + 1,
        ]);

        if ($request->hasFile('foto')) {
            $struktur->addMediaFromRequest('foto')->toMediaCollection('foto');
        }

        Cache::forget('public.tentang');

        return back()->with('success', 'Anggota berhasil ditambahkan.');
    }

    public function update(Request $request, StrukturOrganisasi $struktur_organisasi)
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:struktur_organisasis,id',
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'jabatan_en' => 'nullable|string|max:255',
            'level' => 'required|integer|in:0,1,2',
            'is_active' => 'boolean',
            'foto' => 'nullable|image|max:2048',
        ]);

        $struktur_organisasi->update([
            'parent_id' => $validated['parent_id'],
            'nama' => $validated['nama'],
            'jabatan' => $validated['jabatan'],
            'jabatan_en' => $validated['jabatan_en'] ?? null,
            'level' => $validated['level'],
            'is_active' => $request->has('is_active') ? $validated['is_active'] : $struktur_organisasi->is_active,
        ]);

        if ($request->hasFile('foto')) {
            $struktur_organisasi->addMediaFromRequest('foto')->toMediaCollection('foto');
        } elseif ($request->boolean('remove_foto')) {
            $struktur_organisasi->clearMediaCollection('foto');
        }

        Cache::forget('public.tentang');

        return back()->with('success', 'Anggota berhasil diperbarui.');
    }

    public function destroy(StrukturOrganisasi $struktur_organisasi)
    {
        StrukturOrganisasi::where('parent_id', $struktur_organisasi->id)
            ->update(['parent_id' => $struktur_organisasi->parent_id]);

        $struktur_organisasi->clearMediaCollection('foto');
        $struktur_organisasi->delete();

        Cache::forget('public.tentang');

        return back()->with('success', 'Anggota berhasil dihapus.');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:struktur_organisasis,id',
            'items.*.urutan' => 'required|integer',
            'items.*.parent_id' => 'nullable|exists:struktur_organisasis,id',
        ]);

        foreach ($validated['items'] as $item) {
            $updateData = ['urutan' => $item['urutan']];
            if (array_key_exists('parent_id', $item)) {
                $updateData['parent_id'] = $item['parent_id'];
            }
            StrukturOrganisasi::where('id', $item['id'])->update($updateData);
        }

        Cache::forget('public.tentang');

        return back()->with('success', 'Struktur organisasi berhasil diurutkan.');
    }
}

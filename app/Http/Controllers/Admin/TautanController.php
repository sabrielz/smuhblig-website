<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tautan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TautanController extends Controller
{
    public function index()
    {
        $tautans = Tautan::ordered()->get();

        return Inertia::render('Admin/Tautan/Index', [
            'tautans' => $tautans,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Tautan/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'label_en' => 'nullable|string|max:255',
            'url' => 'required|url|max:255',
            'icon_name' => 'nullable|string|max:255',
            'kategori' => 'nullable|string|max:255',
            'buka_tab_baru' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $validated['sort_order'] = Tautan::max('sort_order') + 1;

        Tautan::create($validated);

        return redirect()->route('admin.tautan.index')->with('success', 'Tautan berhasil ditambahkan');
    }

    public function edit(Tautan $tautan)
    {
        return Inertia::render('Admin/Tautan/Edit', [
            'tautan' => $tautan,
        ]);
    }

    public function update(Request $request, Tautan $tautan)
    {
        if ($request->has('reorder')) {
            $items = $request->validate([
                'items' => 'required|array',
                'items.*.id' => 'required|exists:tautan,id',
                'items.*.sort_order' => 'required|integer',
            ])['items'];

            foreach ($items as $item) {
                Tautan::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
            }

            return back()->with('success', 'Urutan berhasil diperbarui');
        }

        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'label_en' => 'nullable|string|max:255',
            'url' => 'required|url|max:255',
            'icon_name' => 'nullable|string|max:255',
            'kategori' => 'nullable|string|max:255',
            'buka_tab_baru' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $tautan->update($validated);

        return redirect()->route('admin.tautan.index')->with('success', 'Tautan berhasil diperbarui');
    }

    public function destroy(Tautan $tautan)
    {
        $tautan->delete();

        return redirect()->route('admin.tautan.index')->with('success', 'Tautan berhasil dihapus');
    }
}

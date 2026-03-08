<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Statistik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class StatistikController extends Controller
{
    public function index()
    {
        $statistik = Statistik::ordered()->get();

        return Inertia::render('Admin/Statistik/Index', [
            'statistik' => $statistik,
        ]);
    }

    public function update(Request $request, Statistik $statistik)
    {
        $validated = $request->validate([
            'nilai' => 'required|integer|min:0',
            'label' => 'required|string|max:255',
            'label_en' => 'nullable|string|max:255',
            'suffix' => 'nullable|string|max:5',
            'is_active' => 'boolean',
        ]);

        $statistik->update([
            'nilai' => $validated['nilai'],
            'label' => $validated['label'],
            'label_en' => $validated['label_en'] ?? null,
            'suffix' => $validated['suffix'] ?? null,
            'is_active' => $request->has('is_active') ? $validated['is_active'] : $statistik->is_active,
        ]);

        Cache::forget('beranda:id');
        Cache::forget('beranda:en');

        return back()->with('success', 'Statistik berhasil diperbarui.');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:statistiks,id',
            'items.*.sort_order' => 'required|integer',
        ]);

        foreach ($validated['items'] as $item) {
            Statistik::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('beranda:id');
        Cache::forget('beranda:en');

        return back()->with('success', 'Urutan statistik berhasil diperbarui.');
    }
}

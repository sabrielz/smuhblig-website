<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderStatistikRequest;
use App\Http\Requests\Admin\UpdateStatistikRequest;
use App\Http\Resources\Admin\StatistikResource;
use App\Models\Statistik;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class StatistikController extends Controller
{
    public function index()
    {
        $statistik = StatistikResource::collection(Statistik::ordered()->get())->resolve();

        return Inertia::render('Admin/Statistik/Index', [
            'statistik' => $statistik,
        ]);
    }

    public function update(UpdateStatistikRequest $request, Statistik $statistik)
    {
        $validated = $request->validated();

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

    public function reorder(ReorderStatistikRequest $request)
    {
        $validated = $request->validated();

        foreach ($validated['items'] as $item) {
            Statistik::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('beranda:id');
        Cache::forget('beranda:en');

        return back()->with('success', 'Urutan statistik berhasil diperbarui.');
    }
}

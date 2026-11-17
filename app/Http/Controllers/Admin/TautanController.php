<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderTautanRequest;
use App\Http\Requests\Admin\StoreTautanRequest;
use App\Http\Requests\Admin\UpdateTautanRequest;
use App\Http\Resources\Admin\TautanResource;
use App\Models\Tautan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TautanController extends Controller
{
    public function index()
    {
        $tautans = Tautan::ordered()->get();

        return Inertia::render('Admin/Tautan/Index', [
            'tautans' => TautanResource::collection($tautans),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Tautan/Create');
    }

    public function store(StoreTautanRequest $request)
    {
        $validated = $request->validated();

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
            $reorderReq = app(ReorderTautanRequest::class);
            $items = $reorderReq->validated()['items'];

            foreach ($items as $item) {
                Tautan::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
            }

            return back()->with('success', 'Urutan berhasil diperbarui');
        }

        $updateReq = app(UpdateTautanRequest::class);
        $validated = $updateReq->validated();

        $tautan->update($validated);

        return redirect()->route('admin.tautan.index')->with('success', 'Tautan berhasil diperbarui');
    }

    public function destroy(Tautan $tautan)
    {
        $tautan->delete();

        return redirect()->route('admin.tautan.index')->with('success', 'Tautan berhasil dihapus');
    }
}

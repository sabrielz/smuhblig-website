<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreKategoriRequest;
use App\Http\Requests\Admin\UpdateKategoriRequest;
use App\Http\Resources\Admin\KategoriResource;
use App\Models\Category;
use App\Support\CategoryColors;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class KategoriController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Category::class);

        $categories = Category::query()
            ->with(['translations'])
            ->withCount('articles')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Kategori/Index', [
            'categories' => KategoriResource::collection($categories)->response()->getData(true),
            'colors' => CategoryColors::all(),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Category::class);

        return Inertia::render('Admin/Kategori/Form', [
            'category' => null,
            'colors' => CategoryColors::all(),
        ]);
    }

    public function store(StoreKategoriRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $category = Category::create([
            'name' => $validated['name_id'],
            'description' => $validated['description_id'] ?? null,
            'color' => $validated['color'],
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        $category->translations()->create([
            'locale' => 'id',
            'name' => $validated['name_id'],
            'description' => $validated['description_id'] ?? null,
        ]);

        if (! empty($validated['name_en'])) {
            $category->translations()->create([
                'locale' => 'en',
                'name' => $validated['name_en'],
                'description' => $validated['description_en'] ?? null,
            ]);
        }

        return redirect()
            ->route('admin.kategori.index')
            ->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function edit(Category $kategori): Response
    {
        Gate::authorize('update', $kategori);

        $kategori->load('translations');

        return Inertia::render('Admin/Kategori/Form', [
            'category' => (new KategoriResource($kategori))->resolve(),
            'colors' => CategoryColors::all(),
        ]);
    }

    public function update(UpdateKategoriRequest $request, Category $kategori): RedirectResponse
    {
        $validated = $request->validated();

        $kategori->update([
            'name' => $validated['name_id'],
            'description' => $validated['description_id'] ?? null,
            'color' => $validated['color'],
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        // Update / create translation ID
        $kategori->translations()->updateOrCreate(
            ['locale' => 'id'],
            [
                'name' => $validated['name_id'],
                'description' => $validated['description_id'] ?? null,
            ]
        );

        // Update / create translation EN
        if (! empty($validated['name_en'])) {
            $kategori->translations()->updateOrCreate(
                ['locale' => 'en'],
                [
                    'name' => $validated['name_en'],
                    'description' => $validated['description_en'] ?? null,
                ]
            );
        } else {
            $kategori->translations()->where('locale', 'en')->delete();
        }

        return redirect()
            ->route('admin.kategori.index')
            ->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Category $kategori): RedirectResponse
    {
        Gate::authorize('delete', $kategori);

        if ($kategori->articles()->exists()) {
            return redirect()
                ->route('admin.kategori.index')
                ->with('error', 'Kategori tidak dapat dihapus karena masih digunakan oleh artikel.');
        }

        $kategori->delete();

        return redirect()
            ->route('admin.kategori.index')
            ->with('success', 'Kategori berhasil dihapus.');
    }
}

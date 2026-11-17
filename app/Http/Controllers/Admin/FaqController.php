<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderFaqRequest;
use App\Http\Requests\Admin\StoreFaqRequest;
use App\Http\Requests\Admin\UpdateFaqRequest;
use App\Http\Resources\Admin\FaqResource;
use App\Models\Faq;
use App\Services\HtmlSanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Faq::class);

        $query = Faq::query()->with('translations');

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->input('kategori'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('translations', function ($qt) use ($search) {
                    $qt->where('pertanyaan', 'like', "%{$search}%")
                        ->orWhere('jawaban', 'like', "%{$search}%");
                });
            });
        }

        $faqs = $query->ordered()->paginate(20)->withQueryString()->through(function (Faq $item) {
            return (new FaqResource($item))->resolve();
        });

        return Inertia::render('Admin/Faq/Index', [
            'faqs' => $faqs,
            'filters' => $request->only(['kategori', 'search']),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Faq::class);

        return Inertia::render('Admin/Faq/Form', [
            'faq' => null,
        ]);
    }

    public function store(StoreFaqRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated) {
            $maxUrutan = Faq::where('kategori', $validated['kategori'])->max('urutan') ?? 0;

            /** @var Faq $faq */
            $faq = Faq::create([
                'kategori' => $validated['kategori'],
                'urutan' => $validated['urutan'] ?? ($maxUrutan + 1),
                'is_active' => $request->boolean('is_active', true),
            ]);

            $faq->translations()->create([
                'locale' => 'id',
                'pertanyaan' => $validated['translations']['id']['pertanyaan'],
                'jawaban' => HtmlSanitizer::clean($validated['translations']['id']['jawaban']),
                'ai_translated' => false,
                'reviewed' => true,
            ]);

            if (! empty($validated['translations']['en']['pertanyaan'])) {
                $faq->translations()->create([
                    'locale' => 'en',
                    'pertanyaan' => $validated['translations']['en']['pertanyaan'],
                    'jawaban' => ! empty($validated['translations']['en']['jawaban'])
                        ? HtmlSanitizer::clean($validated['translations']['en']['jawaban'])
                        : '',
                    'ai_translated' => false,
                    'reviewed' => true,
                ]);
            }
        });

        Cache::forget('public.faq.id');
        Cache::forget('public.faq.en');

        return redirect()->route('admin.faq.index')->with('success', 'FAQ berhasil ditambahkan.');
    }

    public function edit(Faq $faq): Response
    {
        Gate::authorize('update', $faq);

        $faq->load('translations');

        return Inertia::render('Admin/Faq/Form', [
            'faq' => (new FaqResource($faq))->resolve(),
        ]);
    }

    public function update(UpdateFaqRequest $request, Faq $faq)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $faq, $validated) {
            $faq->update([
                'kategori' => $validated['kategori'],
                'urutan' => $validated['urutan'] ?? $faq->urutan,
                'is_active' => $request->boolean('is_active', true),
            ]);

            $faq->translations()->updateOrCreate(
                ['locale' => 'id'],
                [
                    'pertanyaan' => $validated['translations']['id']['pertanyaan'],
                    'jawaban' => HtmlSanitizer::clean($validated['translations']['id']['jawaban']),
                ]
            );

            if (! empty($validated['translations']['en']['pertanyaan'])) {
                $faq->translations()->updateOrCreate(
                    ['locale' => 'en'],
                    [
                        'pertanyaan' => $validated['translations']['en']['pertanyaan'],
                        'jawaban' => ! empty($validated['translations']['en']['jawaban'])
                            ? HtmlSanitizer::clean($validated['translations']['en']['jawaban'])
                            : '',
                    ]
                );
            } else {
                $faq->translations()->where('locale', 'en')->delete();
            }
        });

        Cache::forget('public.faq.id');
        Cache::forget('public.faq.en');

        return redirect()->route('admin.faq.index')->with('success', 'FAQ berhasil diperbarui.');
    }

    public function destroy(Faq $faq)
    {
        Gate::authorize('delete', $faq);

        $faq->delete();

        Cache::forget('public.faq.id');
        Cache::forget('public.faq.en');

        return redirect()->route('admin.faq.index')->with('success', 'FAQ berhasil dihapus.');
    }

    public function reorder(ReorderFaqRequest $request)
    {
        Gate::authorize('update', Faq::class);

        $orders = $request->validated()['orders'];

        DB::transaction(function () use ($orders) {
            foreach ($orders as $order) {
                Faq::where('id', $order['id'])->update(['urutan' => $order['urutan']]);
            }
        });

        Cache::forget('public.faq.id');
        Cache::forget('public.faq.en');

        return back()->with('success', 'Urutan FAQ berhasil diperbarui.');
    }
}

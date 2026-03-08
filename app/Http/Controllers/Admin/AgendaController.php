<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use App\Http\Requests\Admin\StoreAgendaRequest;
use App\Http\Resources\Admin\AgendaResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AgendaController extends Controller
{
    /**
     * Display a listing of the agendas.
     */
    public function index(Request $request)
    {
        $query = Agenda::with('translations')->orderBy('tanggal_mulai', 'desc');

        if ($request->filled('bulan') && $request->filled('tahun')) {
            $query->byBulan($request->bulan, $request->tahun);
        }

        $agendas = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Agenda/Index', [
            'agendas' => AgendaResource::collection($agendas),
            'filters' => $request->only(['bulan', 'tahun']),
        ]);
    }

    /**
     * Show the form for creating a new agenda.
     */
    public function create()
    {
        return Inertia::render('Admin/Agenda/Form', [
            'agenda' => null,
            'isEdit' => false,
        ]);
    }

    /**
     * Store a newly created agenda in storage.
     */
    public function store(StoreAgendaRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $agenda = Agenda::create([
                'tanggal_mulai' => $validated['tanggal_mulai'],
                'tanggal_selesai' => $validated['tanggal_selesai'] ?? null,
                'warna' => $validated['warna'] ?? '#003f87',
                'tipe' => $validated['tipe'],
                'is_active' => $validated['is_active'] ?? true,
                'slug' => Str::slug($validated['translations']['id']['judul']),
            ]);

            // Ensure slug is properly set during create since sluggable may override it
            // if translations are empty initially
            $agenda->slug = Str::slug($validated['translations']['id']['judul']);
            $agenda->saveQuietly();

            foreach ($validated['translations'] as $locale => $data) {
                if ($locale === 'en' && empty($data['judul'])) continue;

                $agenda->translations()->create([
                    'locale' => $locale,
                    'judul' => $data['judul'],
                    'deskripsi' => $data['deskripsi'] ?? null,
                    'lokasi' => $data['lokasi'] ?? null,
                    'ai_translated' => false,
                    'reviewed' => true,
                ]);
            }
        });

        return redirect()->route('admin.agenda.index')->with('success', 'Agenda berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified agenda.
     */
    public function edit(Agenda $agenda)
    {
        $agenda->load('translations');

        return Inertia::render('Admin/Agenda/Form', [
            'agenda' => new AgendaResource($agenda),
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified agenda in storage.
     */
    public function update(StoreAgendaRequest $request, Agenda $agenda)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $agenda) {
            // Check if title ID changed, then update slug accordingly
            $oldTitleId = $agenda->translations()->where('locale', 'id')->value('judul');
            $newTitleId = $validated['translations']['id']['judul'];

            $agenda->update([
                'tanggal_mulai' => $validated['tanggal_mulai'],
                'tanggal_selesai' => $validated['tanggal_selesai'] ?? null,
                'warna' => $validated['warna'] ?? '#003f87',
                'tipe' => $validated['tipe'],
                'is_active' => $validated['is_active'] ?? true,
            ]);

            if ($oldTitleId !== $newTitleId) {
                // If the sluggable package doesn't update it automatically, save custom
                $agenda->slug = Str::slug($newTitleId);
                $agenda->saveQuietly();
            }

            foreach (['id', 'en'] as $locale) {
                $data = $validated['translations'][$locale] ?? null;

                if ($locale === 'en' && empty($data['judul'])) {
                    $agenda->translations()->where('locale', 'en')->delete();
                    continue;
                }

                if ($data) {
                    $agenda->translations()->updateOrCreate(
                        ['locale' => $locale],
                        [
                            'judul' => $data['judul'],
                            'deskripsi' => $data['deskripsi'] ?? null,
                            'lokasi' => $data['lokasi'] ?? null,
                            'ai_translated' => false,
                            'reviewed' => true,
                        ]
                    );
                }
            }
        });

        return redirect()->route('admin.agenda.index')->with('success', 'Agenda berhasil diperbarui.');
    }

    /**
     * Remove the specified agenda from storage.
     */
    public function destroy(Agenda $agenda)
    {
        $agenda->delete();
        return redirect()->route('admin.agenda.index')->with('success', 'Agenda berhasil dihapus.');
    }
}

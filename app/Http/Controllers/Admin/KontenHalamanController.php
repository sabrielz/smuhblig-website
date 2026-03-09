<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\TranslateHalamanKonten;
use App\Models\AiJob;
use App\Models\HalamanKonten;
use App\Models\HalamanKontenTranslation;
use App\Services\HtmlSanitizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Mengelola konten teks dinamis all halaman publik via tabel halaman_konten.
 *
 * Rute:
 *   GET  /admin/konten/{halaman}           → edit()   (Inertia render)
 *   GET  /admin/konten/{halaman}/data      → show()   (JSON data for polling/refresh)
 *   POST /admin/konten/{halaman}           → update()
 *   POST /admin/konten/{halaman}/translate → translateAll()
 */
class KontenHalamanController extends Controller
{
    /** Daftar halaman yang dikelola */
    private const HALAMAN_VALID = ['beranda', 'tentang', 'kontak'];

    /* ------------------------------------------------------------------ *
     |  Inertia Page — Edit
     * ------------------------------------------------------------------ */

    /**
     * Render halaman edit konten (Inertia).
     */
    public function edit(string $halaman): Response
    {
        $halaman = $this->resolveHalaman($halaman);

        return Inertia::render('Admin/KontenHalaman/Edit', [
            'halaman'        => $halaman,
            'halamanValid'   => self::HALAMAN_VALID,
            'kontenGrouped'  => $this->getKontenGrouped($halaman),
        ]);
    }

    /* ------------------------------------------------------------------ *
     |  JSON — Show (data refresh after save / AI done)
     * ------------------------------------------------------------------ */

    /**
     * Kembalikan JSON konten yang dikelompokkan per section.
     *
     * Contoh response:
     * {
     *   "hero": [
     *     { "id": 1, "key": "headline", "label": "...", "type": "text",
     *       "translations": { "id": {...}, "en": {...} } }
     *   ],
     *   "statistik": [...]
     * }
     */
    public function show(string $halaman): JsonResponse
    {
        $halaman = $this->resolveHalaman($halaman);

        return response()->json([
            'halaman'       => $halaman,
            'kontenGrouped' => $this->getKontenGrouped($halaman),
        ]);
    }

    /* ------------------------------------------------------------------ *
     |  Update
     * ------------------------------------------------------------------ */

    /**
     * Simpan semua konten yang dikirim.
     *
     * Payload yang diharapkan:
     * {
     *   "hero": {
     *     "headline": { "id": "...", "en": "..." },
     *     "subheadline": { "id": "...", "en": "..." }
     *   },
     *   "info": {
     *     "jam_operasional": { "id": "...", "en": "..." }
     *   }
     * }
     */
    public function update(Request $request, string $halaman): JsonResponse
    {
        $halaman = $this->resolveHalaman($halaman);

        $payload = $request->validate([
            '*'           => ['nullable', 'array'],
            '*.*'         => ['nullable', 'array'],
            '*.*.*'       => ['nullable', 'string'],
        ]);

        // Ambil semua konten halaman ini dengan translations → index by key
        $kontenItems = HalamanKonten::where('halaman', $halaman)
            ->with('translations')
            ->get()
            ->keyBy(fn ($item) => "{$item->section}.{$item->key}");

        foreach ($payload as $section => $keys) {
            if (!is_array($keys)) {
                continue;
            }

            foreach ($keys as $key => $locales) {
                if (!is_array($locales)) {
                    continue;
                }

                $konten = $kontenItems->get("{$section}.{$key}");
                if (!$konten) {
                    continue;
                }

                foreach ($locales as $locale => $value) {
                    if (!in_array($locale, ['id', 'en'], true)) {
                        continue;
                    }

                    // Sanitasi HTML untuk konten richtext (dari TipTap editor)
                    if ($konten->type === 'richtext' && !empty($value)) {
                        $value = HtmlSanitizer::clean($value);
                    }

                    $existingTranslation = $konten->translations->firstWhere('locale', $locale);

                    // Tentukan apakah nilai berubah dari nilai AI sebelumnya
                    $wasAiTranslated = $existingTranslation?->ai_translated ?? false;
                    $valueChanged    = $existingTranslation
                        ? ($existingTranslation->value !== $value)
                        : true;

                    // Jika nilai berubah dan sebelumnya dari AI → reset ai_translated
                    $aiTranslated = ($wasAiTranslated && $valueChanged)
                        ? false
                        : ($wasAiTranslated ?? false);

                    HalamanKontenTranslation::updateOrCreate(
                        [
                            'halaman_konten_id' => $konten->id,
                            'locale'            => $locale,
                        ],
                        [
                            'value'        => $value ?? '',
                            'ai_translated' => $aiTranslated,
                        ]
                    );
                }
            }
        }

        $this->clearCache($halaman);

        return response()->json([
            'success' => true,
            'message' => 'Konten berhasil disimpan.',
        ]);
    }

    /* ------------------------------------------------------------------ *
     |  Translate All via AI Queue
     * ------------------------------------------------------------------ */

    /**
     * Dispatch job penerjemahan semua konten locale 'id' → 'en'.
     * Konten yang sudah direview (reviewed=true) dilewati.
     */
    public function translateAll(Request $request, string $halaman): JsonResponse
    {
        $halaman = $this->resolveHalaman($halaman);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $aiJob = AiJob::create([
            'user_id'    => $user->id,
            'job_type'   => 'translate_halaman',
            'model_type' => HalamanKonten::class,
            'input'      => json_encode(
                ['halaman' => $halaman],
                JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE
            ),
            'status'     => 'pending',
        ]);

        TranslateHalamanKonten::dispatch($aiJob, $halaman)->onQueue('ai');

        return response()->json([
            'jobId'   => $aiJob->id,
            'status'  => 'pending',
            'message' => 'Terjemahan dimulai di background. Silakan polling status.',
        ], 202);
    }

    /* ------------------------------------------------------------------ *
     |  Private helpers
     * ------------------------------------------------------------------ */

    /**
     * Validasi dan normalkan nama halaman.
     */
    private function resolveHalaman(string $halaman): string
    {
        $halaman = strtolower(trim($halaman));

        if (!in_array($halaman, self::HALAMAN_VALID, true)) {
            abort(404, "Halaman '{$halaman}' tidak dikelola di CMS ini.");
        }

        return $halaman;
    }

    /**
     * Ambil data konten grouped by section, include semua translations.
     *
     * @return array<string, array<int, array<string, mixed>>>
     */
    private function getKontenGrouped(string $halaman): array
    {
        $items = HalamanKonten::where('halaman', $halaman)
            ->with('translations')
            ->orderBy('section')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        $grouped = [];

        foreach ($items as $konten) {
            $translationsMap = [];
            foreach ($konten->translations as $translation) {
                $translationsMap[$translation->locale] = [
                    'id'           => $translation->id,
                    'value'        => $translation->value,
                    'ai_translated' => (bool) $translation->ai_translated,
                    'reviewed'     => (bool) $translation->reviewed,
                ];
            }

            $grouped[$konten->section][] = [
                'id'           => $konten->id,
                'key'          => $konten->key,
                'label'        => $konten->label ?? $konten->key,
                'type'         => $konten->type,
                'sort_order'   => $konten->sort_order,
                'translations' => $translationsMap,
            ];
        }

        return $grouped;
    }

    /**
     * Clear cache terkait halaman yang diperbarui.
     */
    private function clearCache(string $halaman): void
    {
        try {
            Cache::tags(['halaman_konten', "halaman_{$halaman}"])->flush();
        } catch (\Throwable) {
            // Cache tags tidak didukung di driver file/array — graceful fallback
            Cache::forget("halaman_konten_{$halaman}");
        }
    }
}

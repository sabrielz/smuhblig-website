<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AgendaResource;
use App\Models\Agenda;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class AgendaPublikController extends Controller
{
    public function index(Request $request)
    {
        $locale = app()->getLocale();
        $bulanFilter = $request->query('bulan');
        $tahunFilter = $request->query('tahun');

        $cacheKey = "agenda_publik_{$locale}_{$bulanFilter}_{$tahunFilter}";

        $agendas = Cache::remember($cacheKey, now()->addMinutes(30), function () use ($bulanFilter, $tahunFilter) {
            $query = Agenda::with('translations')->active()->orderBy('tanggal_mulai', 'asc');

            if ($bulanFilter && $tahunFilter) {
                // If specific filter is provided
                $query->byBulan($bulanFilter, $tahunFilter);
            } else {
                // By default: this month and next month (or just upcoming from start of this month)
                $startOfThisMonth = Carbon::now()->startOfMonth();
                $endOfNextMonth = Carbon::now()->addMonth()->endOfMonth();

                $query->whereBetween('tanggal_mulai', [$startOfThisMonth, $endOfNextMonth]);
            }

            return AgendaResource::collection($query->get())->resolve();
        });

        // Group by month-year
        $grouped = collect($agendas)->groupBy(function ($agenda) {
            try {
                $date = Carbon::parse($agenda['tanggal_mulai']);

                return $date->format('Y-m');
            } catch (\Exception $e) {
                return 'unknown';
            }
        });

        // Current month and 3 next months for filter buttons
        $filterOptions = [];
        $currentDate = Carbon::now()->startOfMonth();
        for ($i = 0; $i < 4; $i++) {
            $monthDate = $currentDate->copy()->addMonths($i);
            $filterOptions[] = [
                'bulan' => $monthDate->month,
                'tahun' => $monthDate->year,
                'label_id' => $monthDate->translatedFormat('F Y'),
                'label_en' => $monthDate->locale('en')->format('F Y'),
                'value' => $monthDate->format('Y-m'),
            ];
        }

        return Inertia::render('Public/Agenda', [
            'agendasGrouped' => $grouped,
            'filterOptions' => $filterOptions,
            'activeFilter' => $bulanFilter && $tahunFilter ? "{$tahunFilter}-".str_pad($bulanFilter, 2, '0', STR_PAD_LEFT) : null,
        ]);
    }

    public function show(Agenda $agenda)
    {
        if (! $agenda->is_active) {
            abort(404);
        }

        $agenda->load('translations');

        return Inertia::render('Public/AgendaDetail', [
            'agenda' => new AgendaResource($agenda),
        ]);
    }

    public function ics(Agenda $agenda): Response
    {
        if (! $agenda->is_active) {
            abort(404);
        }

        $agenda->load('translations');
        $locale = app()->getLocale();
        $trans = $agenda->translation($locale) ?? $agenda->translation('id') ?? $agenda->translations()->first();

        $judul = $trans ? $trans->judul : ($agenda->judul ?? 'Agenda');
        $deskripsi = $trans ? $trans->deskripsi : '';
        $lokasi = $trans ? ($trans->lokasi ?? '') : '';

        // Format tanggal all-day (VALUE=DATE:YYYYMMDD)
        $dtStart = $agenda->tanggal_mulai->format('Ymd');

        // iCalendar standar DTEND untuk all-day adalah exclusive (tanggal_selesai + 1 hari)
        $endDate = $agenda->tanggal_selesai
            ? $agenda->tanggal_selesai->copy()->addDay()
            : $agenda->tanggal_mulai->copy()->addDay();
        $dtEnd = $endDate->format('Ymd');

        // Bersihkan deskripsi & lokasi (strip tags & escape koma, titik dua, backslash)
        $cleanDesc = strip_tags($deskripsi);
        $cleanDesc = str_replace(["\r\n", "\r", "\n"], '\\n', $cleanDesc);
        $cleanDesc = addcslashes($cleanDesc, ',;\\');

        $cleanSummary = addcslashes($judul, ',;\\');
        $cleanLocation = addcslashes($lokasi, ',;\\');

        $dtStamp = now()->format('Ymd\THis\Z');
        $uid = "agenda-{$agenda->id}@smkmuhbligo.sch.id";

        $lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//SMK Muhammadiyah Bligo//NONSGML v1.0//ID',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            "UID:{$uid}",
            "DTSTAMP:{$dtStamp}",
            "DTSTART;VALUE=DATE:{$dtStart}",
            "DTEND;VALUE=DATE:{$dtEnd}",
            "SUMMARY:{$cleanSummary}",
            "DESCRIPTION:{$cleanDesc}",
            "LOCATION:{$cleanLocation}",
            'STATUS:CONFIRMED',
            'END:VEVENT',
            'END:VCALENDAR',
        ];

        // Format baris diakhiri CRLF (\r\n) sesuai RFC 5545
        $content = implode("\r\n", $lines)."\r\n";
        $filename = "agenda-{$agenda->slug}.ics";

        return response($content, 200, [
            'Content-Type' => 'text/calendar; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}

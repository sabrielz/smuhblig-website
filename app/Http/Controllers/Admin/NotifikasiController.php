<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotifikasiAdmin;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class NotifikasiController extends Controller
{
    /**
     * Halaman list semua notifikasi untuk user yang sedang login.
     */
    public function index(Request $request): Response
    {
        $filter = $request->query('filter', 'semua'); // semua | belum | sudah

        $query = NotifikasiAdmin::untukUser($request->user()->id)
            ->latest();

        if ($filter === 'belum') {
            $query->belumDibaca();
        } elseif ($filter === 'sudah') {
            $query->whereNotNull('dibaca_at');
        }

        $notifikasi = $query->paginate(20)->through(fn ($n) => [
            'id'         => $n->id,
            'tipe'       => $n->tipe,
            'judul'      => $n->judul,
            'pesan'      => $n->pesan,
            'url'        => $n->url,
            'dibaca'     => !is_null($n->dibaca_at),
            'dibaca_at'  => $n->dibaca_at?->diffForHumans(),
            'created_at' => $n->created_at->diffForHumans(),
        ]);

        $belumDibacaCount = NotifikasiAdmin::untukUser($request->user()->id)
            ->belumDibaca()
            ->count();

        return Inertia::render('Admin/Notifikasi/Index', [
            'notifikasi'      => $notifikasi,
            'activeFilter'    => $filter,
            'belumDibacaCount' => $belumDibacaCount,
        ]);
    }

    /**
     * Tandai 1 notifikasi sebagai dibaca (via Inertia redirect).
     */
    public function baca(Request $request, NotifikasiAdmin $notifikasi): RedirectResponse
    {
        abort_if($notifikasi->user_id !== $request->user()->id, 403);
        $notifikasi->tandaiBaca();

        if ($notifikasi->url) {
            return redirect($notifikasi->url);
        }

        return redirect()->back();
    }

    /**
     * Tandai semua notifikasi sebagai dibaca.
     */
    public function bacaSemua(Request $request): RedirectResponse
    {
        NotifikasiAdmin::untukUser($request->user()->id)
            ->belumDibaca()
            ->update(['dibaca_at' => now()]);

        return redirect()->back()->with('success', 'Semua notifikasi ditandai dibaca.');
    }

    /**
     * Hapus satu notifikasi.
     */
    public function hapus(Request $request, NotifikasiAdmin $notifikasi): RedirectResponse
    {
        abort_if($notifikasi->user_id !== $request->user()->id, 403);
        $notifikasi->delete();

        return redirect()->back()->with('success', 'Notifikasi dihapus.');
    }

    /**
     * AJAX: Tandai 1 notifikasi dibaca & return JSON (untuk dropdown topbar).
     */
    public function bacaAjax(Request $request, NotifikasiAdmin $notifikasi): JsonResponse
    {
        if ($notifikasi->user_id !== $request->user()->id) {
            return response()->json(['success' => false], 403);
        }

        $notifikasi->tandaiBaca();

        return response()->json(['success' => true]);
    }

    /**
     * AJAX: Tandai semua dibaca & return JSON count.
     */
    public function bacaSemuaAjax(Request $request): JsonResponse
    {
        NotifikasiAdmin::untukUser($request->user()->id)
            ->belumDibaca()
            ->update(['dibaca_at' => now()]);

        return response()->json([
            'success' => true,
            'count'   => 0,
        ]);
    }

    /**
     * AJAX: Return daftar notifikasi terbaru untuk dropdown (max 10).
     */
    public function recent(Request $request): JsonResponse
    {
        $items = NotifikasiAdmin::untukUser($request->user()->id)
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($n) => [
                'id'         => $n->id,
                'tipe'       => $n->tipe,
                'judul'      => $n->judul,
                'pesan'      => $n->pesan,
                'url'        => $n->url,
                'dibaca'     => !is_null($n->dibaca_at),
                'created_at' => $n->created_at->diffForHumans(),
            ]);

        $belum = NotifikasiAdmin::untukUser($request->user()->id)
            ->belumDibaca()
            ->count();

        return response()->json([
            'items' => $items,
            'count' => $belum,
        ]);
    }
}

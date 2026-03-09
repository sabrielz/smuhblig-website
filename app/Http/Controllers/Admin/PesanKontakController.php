<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PesanKontak;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PesanKontakController extends Controller
{
    /**
     * Display a listing of contact messages with filters and pagination.
     */
    public function index(Request $request): Response
    {
        $query = PesanKontak::with('pembaca')
            ->orderBy('created_at', 'desc');

        if ($request->filled('status') && $request->input('status') !== 'semua') {
            $query->where('status', $request->input('status'));
        }

        $pesans = $query->paginate(20)->withQueryString()->through(fn ($p) => [
            'id'             => $p->id,
            'nama'           => $p->nama,
            'email'          => $p->email,
            'nomor_telepon'  => $p->nomor_telepon,
            'subjek'         => $p->subjek,
            'status'         => $p->status,
            'ip_address'     => $p->ip_address,
            'dibaca_at'      => $p->dibaca_at?->toISOString(),
            'dibaca_oleh'    => $p->pembaca?->name,
            'created_at'     => $p->created_at->toISOString(),
        ]);

        $totalBaru = PesanKontak::baru()->count();

        return Inertia::render('Admin/PesanKontak/Index', [
            'pesans'     => $pesans,
            'filters'    => $request->only(['status']),
            'totalBaru'  => $totalBaru,
        ]);
    }

    /**
     * Display the specified message AND mark it as read.
     */
    public function show(PesanKontak $pesanKontak, Request $request): Response
    {
        // Auto-mark as read when opened
        if ($pesanKontak->status === 'baru') {
            $pesanKontak->tandaiBaca($request->user());
        }

        $pesanKontak->load('pembaca');

        return Inertia::render('Admin/PesanKontak/Show', [
            'pesan' => [
                'id'             => $pesanKontak->id,
                'nama'           => $pesanKontak->nama,
                'email'          => $pesanKontak->email,
                'nomor_telepon'  => $pesanKontak->nomor_telepon,
                'subjek'         => $pesanKontak->subjek,
                'pesan'          => $pesanKontak->pesan,
                'status'         => $pesanKontak->status,
                'ip_address'     => $pesanKontak->ip_address,
                'user_agent'     => $pesanKontak->user_agent,
                'dibaca_at'      => $pesanKontak->dibaca_at?->toISOString(),
                'dibaca_oleh'    => $pesanKontak->pembaca?->name,
                'created_at'     => $pesanKontak->created_at->toISOString(),
            ],
        ]);
    }

    /**
     * Archive the specified message.
     */
    public function arsip(PesanKontak $pesanKontak): RedirectResponse
    {
        $pesanKontak->update(['status' => 'diarsip']);

        return back()->with('success', 'Pesan berhasil diarsipkan.');
    }

    /**
     * Bulk archive multiple messages.
     */
    public function bulkArsip(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['integer', 'exists:pesan_kontak,id'],
        ]);

        PesanKontak::whereIn('id', $validated['ids'])->update(['status' => 'diarsip']);

        return back()->with('success', count($validated['ids']) . ' pesan berhasil diarsipkan.');
    }

    /**
     * Remove the specified message from storage.
     */
    public function destroy(PesanKontak $pesanKontak): RedirectResponse
    {
        $pesanKontak->delete();

        return redirect()
            ->route('admin.pesan.index')
            ->with('success', 'Pesan berhasil dihapus.');
    }
}

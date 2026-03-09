<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StorePesanKontakRequest;
use App\Jobs\KirimNotifikasiPesanBaru;
use App\Models\NotifikasiAdmin;
use App\Models\PesanKontak;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class PesanKontakController extends Controller
{
    /**
     * Store a newly created contact message.
     */
    public function store(StorePesanKontakRequest $request): RedirectResponse
    {
        // Honeypot check — if 'website' field is filled, silently reject (anti-bot)
        if ($request->filled('website')) {
            return back()->with('success', 'Pesan Anda berhasil dikirim.');
        }

        $validated = $request->validated();

        // Create the message record
        $pesan = PesanKontak::create([
            'nama'           => $validated['nama'],
            'email'          => $validated['email'],
            'nomor_telepon'  => $validated['nomor_telepon'] ?? null,
            'subjek'         => $validated['subjek'],
            'pesan'          => $validated['pesan'],
            'status'         => 'baru',
            'ip_address'     => $request->ip(),
            'user_agent'     => $request->userAgent(),
        ]);

        // Dispatch email notification job to default queue
        KirimNotifikasiPesanBaru::dispatch($pesan);

        // Create admin notifications for all admin users
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            NotifikasiAdmin::create([
                'user_id' => $admin->id,
                'tipe'    => 'pesan_kontak',
                'judul'   => 'Pesan baru dari ' . $pesan->nama,
                'konten'  => 'Subjek: ' . $pesan->subjek,
                'url'     => '/admin/pesan/' . $pesan->id,
                'data'    => ['pesan_id' => $pesan->id],
            ]);
        }

        return back()->with('success', 'Pesan Anda berhasil dikirim.');
    }
}

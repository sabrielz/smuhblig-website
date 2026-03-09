<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\TestEmailMail;
use App\Models\Pengaturan;
use App\Services\EmailConfigService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PengaturanController extends Controller
{
    public function index()
    {
        $settings = Pengaturan::getAllSettings();

        // AI Statistics
        $aiStats = [
            'total_jobs' => \App\Models\AiJob::whereMonth('created_at', now()->month)
                                             ->whereYear('created_at', now()->year)
                                             ->count(),
            'completed' => \App\Models\AiJob::where('status', 'done')
                                             ->whereMonth('created_at', now()->month)
                                             ->whereYear('created_at', now()->year)
                                             ->count(),
            'failed' => \App\Models\AiJob::where('status', 'failed')
                                          ->whereMonth('created_at', now()->month)
                                          ->whereYear('created_at', now()->year)
                                          ->count(),
            'cost_estimate' => \App\Models\AiJob::where('status', 'done')
                                                ->whereMonth('created_at', now()->month)
                                                ->whereYear('created_at', now()->year)
                                                ->sum('tokens_used') * 15, // Estimasi Rp15 / token
        ];

        return Inertia::render('Admin/Pengaturan/Index', [
            'settings' => $settings,
            'aiStats' => $aiStats,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->except(['_token', 'site_logo_file', 'site_favicon_file']);

        foreach ($data as $key => $value) {
            Pengaturan::set($key, $value);
        }

        if ($request->hasFile('site_logo_file')) {
            $path = $request->file('site_logo_file')->store('settings', 'public');
            Pengaturan::set('app_logo', 'storage/' . $path);
        }

        if ($request->hasFile('site_favicon_file')) {
            $path = $request->file('site_favicon_file')->store('settings', 'public');
            Pengaturan::set('app_favicon', 'storage/' . $path);
        }

        // Clear application cache if settings are changed
        Cache::flush();
        EmailConfigService::flushCache();

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui');
    }

    public function testEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Alamat email tidak valid.',
            ], 422);
        }

        try {
            // Re-apply dynamic config sebelum kirim
            EmailConfigService::configure();

            $siteName = Pengaturan::get('site_name', 'SMK Muhammadiyah Bligo');

            Mail::to($request->email)->send(new TestEmailMail($siteName));

            return response()->json([
                'success' => true,
                'message' => 'Email test berhasil dikirim ke ' . $request->email,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim email: ' . $e->getMessage(),
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePengaturanRequest;
use App\Mail\TestEmailMail;
use App\Models\AiJob;
use App\Models\Pengaturan;
use App\Services\EmailConfigService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PengaturanController extends Controller
{
    public function index()
    {
        $settings = Pengaturan::getAllSettings();

        // AI Statistics
        $aiStats = [
            'total_jobs' => AiJob::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'completed' => AiJob::where('status', 'done')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'failed' => AiJob::where('status', 'failed')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'cost_estimate' => AiJob::where('status', 'done')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('tokens_used') * 15, // Estimasi Rp15 / token
        ];

        return Inertia::render('Admin/Pengaturan/Index', [
            'settings' => $settings,
            'aiStats' => $aiStats,
        ]);
    }

    public function store(StorePengaturanRequest $request)
    {
        $validated = $request->validated();
        $fileKeys = ['site_logo_file', 'site_favicon_file'];

        foreach ($validated as $key => $value) {
            if (in_array($key, $fileKeys, true)) {
                continue;
            }
            Pengaturan::set($key, $value);
        }

        if ($request->hasFile('site_logo_file')) {
            $file = $request->file('site_logo_file');
            $ext = $file->getClientOriginalExtension() ?: 'png';
            $filename = Str::uuid().'.'.$ext;
            $path = $file->storeAs('settings', $filename, 'public');
            Pengaturan::set('app_logo', 'storage/'.$path);
        }

        if ($request->hasFile('site_favicon_file')) {
            $file = $request->file('site_favicon_file');
            $ext = $file->getClientOriginalExtension() ?: 'ico';
            $filename = Str::uuid().'.'.$ext;
            $path = $file->storeAs('settings', $filename, 'public');
            Pengaturan::set('app_favicon', 'storage/'.$path);
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
                'message' => 'Email test berhasil dikirim ke '.$request->email,
            ]);
        } catch (\Throwable $e) {
            Log::error('Gagal mengirim email test', ['exception' => $e]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengirim email, silakan coba lagi.',
            ], 500);
        }
    }
}

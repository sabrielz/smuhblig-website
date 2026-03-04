<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Pengaturan;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class TentangController extends Controller
{
    public function index(): Response
    {
        $data = Cache::remember('public.tentang', 60 * 60, function () {
            return [
                'pengaturan' => Pengaturan::getAllSettings(),
            ];
        });

        return Inertia::render('Public/Tentang', [
            'pengaturan' => $data['pengaturan'],
        ]);
    }
}

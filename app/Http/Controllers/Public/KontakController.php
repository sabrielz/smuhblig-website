<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Pengaturan;
use App\Models\Tautan;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class KontakController extends Controller
{
    public function index(): Response
    {
        $tautan = Cache::remember('public.kontak.tautan', 60 * 60, function () {
            return Tautan::active()->ordered()->get()->map(fn ($t) => [
                'id'           => $t->id,
                'label'        => $t->label,
                'url'          => $t->url,
                'deskripsi'    => $t->deskripsi,
                'icon_name'    => $t->icon_name,
                'kategori'     => $t->kategori,
                'buka_tab_baru' => $t->buka_tab_baru,
            ]);
        });

        $pengaturan = Cache::remember('public.kontak.pengaturan', 60 * 60, function () {
            return Pengaturan::getAllSettings();
        });

        return Inertia::render('Public/Kontak', [
            'pengaturan' => $pengaturan,
            'tautan'     => $tautan,
        ]);
    }
}

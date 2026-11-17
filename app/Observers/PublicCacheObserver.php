<?php

namespace App\Observers;

use App\Models\Agenda;
use App\Models\Article;
use App\Models\Ekstrakurikuler;
use App\Models\Faq;
use App\Models\Fasilitas;
use App\Models\Galeri;
use App\Models\Guru;
use App\Models\Jurusan;
use App\Models\Mitra;
use App\Models\Pengumuman;
use App\Models\Prestasi;
use App\Models\Statistik;
use App\Models\StrukturOrganisasi;
use App\Models\Testimoni;
use App\Models\Unduhan;
use App\Models\Video;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class PublicCacheObserver
{
    /**
     * Map model class ke tag cache modulnya.
     *
     * @var array<class-string<Model>, string>
     */
    protected static array $tagMap = [
        Article::class => 'berita',
        Agenda::class => 'agenda',
        Ekstrakurikuler::class => 'ekstrakurikuler',
        Fasilitas::class => 'fasilitas',
        Faq::class => 'faq',
        Galeri::class => 'galeri',
        Guru::class => 'guru',
        Jurusan::class => 'jurusan',
        Mitra::class => 'mitra',
        Pengumuman::class => 'pengumuman',
        Prestasi::class => 'prestasi',
        Statistik::class => 'statistik',
        StrukturOrganisasi::class => 'struktur_organisasi',
        Testimoni::class => 'testimoni',
        Unduhan::class => 'unduhan',
        Video::class => 'video',
    ];

    /**
     * Flush cache terkait saat model disimpan (create/update).
     */
    public function saved(Model $model): void
    {
        $this->flushCache($model);
    }

    /**
     * Flush cache terkait saat model dihapus.
     */
    public function deleted(Model $model): void
    {
        $this->flushCache($model);
    }

    /**
     * Eksekusi pembersihan tag cache publik.
     */
    protected function flushCache(Model $model): void
    {
        $class = get_class($model);
        $modulTag = self::$tagMap[$class] ?? 'konten';

        if (Cache::supportsTags()) {
            Cache::tags(['publik', $modulTag])->flush();
            Cache::tags(['publik', 'beranda'])->flush();
        } else {
            // Fallback untuk driver cache yang tidak mendukung tags (misal: array/file)
            // Hapus cache umum beranda
            Cache::forget('public.beranda.id');
            Cache::forget('public.beranda.en');
            Cache::forget('beranda_view_data_id');
            Cache::forget('beranda_view_data_en');
        }
    }
}

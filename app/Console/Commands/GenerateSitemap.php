<?php

namespace App\Console\Commands;

use App\Models\Agenda;
use App\Models\Article;
use App\Models\Galeri;
use App\Models\Jurusan;
use App\Models\Pengaturan;
use App\Models\Pengumuman;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate the sitemap.xml for the site';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating sitemap...');

        $multibahasa = Pengaturan::bool('multibahasa_enabled', true);
        $baseUrl = config('app.url', 'https://smkmuhbligo.sch.id');

        $makeUrl = function (string $path, float $priority, string $changeFreq) use ($baseUrl, $multibahasa): Url {
            $tag = Url::create($path)
                ->setPriority($priority)
                ->setChangeFrequency($changeFreq);

            if ($multibahasa) {
                $tag->addAlternate("{$baseUrl}{$path}?lang=id", 'id');
                $tag->addAlternate("{$baseUrl}{$path}?lang=en", 'en');
            }

            return $tag;
        };

        $sitemap = Sitemap::create()
            // Home page
            ->add($makeUrl('/', 1.0, Url::CHANGE_FREQUENCY_DAILY))
            // Static pages
            ->add($makeUrl('/tentang', 0.8, Url::CHANGE_FREQUENCY_WEEKLY))
            ->add($makeUrl('/jurusan', 0.8, Url::CHANGE_FREQUENCY_WEEKLY))
            ->add($makeUrl('/berita', 0.8, Url::CHANGE_FREQUENCY_DAILY))
            ->add($makeUrl('/agenda', 0.8, Url::CHANGE_FREQUENCY_WEEKLY))
            ->add($makeUrl('/galeri', 0.8, Url::CHANGE_FREQUENCY_WEEKLY))
            ->add($makeUrl('/kontak', 0.8, Url::CHANGE_FREQUENCY_MONTHLY))
            ->add($makeUrl('/tautan', 0.8, Url::CHANGE_FREQUENCY_MONTHLY));

        // Jurusan pages
        Jurusan::active()->get()->each(function (Jurusan $jurusan) use ($sitemap, $makeUrl) {
            $sitemap->add(
                $makeUrl("/jurusan/{$jurusan->slug}", 0.9, Url::CHANGE_FREQUENCY_WEEKLY)
            );
        });

        // Pengumuman pages
        Pengumuman::aktif()->get()->each(function (Pengumuman $pengumuman) use ($sitemap, $makeUrl) {
            $sitemap->add(
                $makeUrl("/pengumuman/{$pengumuman->slug}", 0.7, Url::CHANGE_FREQUENCY_WEEKLY)
                    ->setLastModificationDate($pengumuman->updated_at)
            );
        });

        // Galeri Album pages
        Galeri::active()->get()->each(function (Galeri $galeri) use ($sitemap, $makeUrl) {
            $sitemap->add(
                $makeUrl("/galeri/{$galeri->slug}", 0.7, Url::CHANGE_FREQUENCY_MONTHLY)
                    ->setLastModificationDate($galeri->updated_at)
            );
        });

        // Agenda pages
        Agenda::active()->get()->each(function (Agenda $agenda) use ($sitemap, $makeUrl) {
            $sitemap->add(
                $makeUrl("/agenda/{$agenda->slug}", 0.7, Url::CHANGE_FREQUENCY_WEEKLY)
                    ->setLastModificationDate($agenda->updated_at)
            );
        });

        // Article pages (only published and published_at <= now())
        Article::terbit()->get()->each(function (Article $article) use ($sitemap, $makeUrl) {
            $sitemap->add(
                $makeUrl("/berita/{$article->slug}", 0.7, Url::CHANGE_FREQUENCY_MONTHLY)
                    ->setLastModificationDate($article->updated_at)
            );
        });

        $path = public_path('sitemap.xml');
        $sitemap->writeToFile($path);

        $this->info("Sitemap generated successfully at {$path}");
    }
}

<?php

namespace App\Support;

use App\Models\Agenda;
use App\Models\Article;
use App\Models\Galeri;
use App\Models\Jurusan;
use App\Models\Pengaturan;
use App\Models\Prestasi;
use App\Models\User;

class JsonLd
{
    /**
     * Skema Organisasi Pendidikan (Default / Root).
     *
     * @return array<string, mixed>
     */
    public static function educationalOrganization(): array
    {
        $siteName = Pengaturan::get('site_name', 'SMK Muhammadiyah Bligo');
        $siteTagline = Pengaturan::get('site_tagline', 'Mencetak Generasi Unggul dan Berakhlak');
        $siteAddress = Pengaturan::get('site_address', 'Jl. Raya Bligo, Buaran');
        $sitePhone = Pengaturan::get('site_phone', '(0285) 4416164');
        $siteEmail = Pengaturan::get('site_email', 'smkmuhbligo@yahoo.com');
        $baseUrl = config('app.url', 'https://smkmuhbligo.sch.id');

        return [
            '@context' => 'https://schema.org',
            '@type' => 'EducationalOrganization',
            'name' => $siteName,
            'url' => $baseUrl,
            'description' => $siteTagline,
            'telephone' => $sitePhone,
            'email' => $siteEmail,
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => $siteAddress,
                'addressLocality' => 'Pekalongan',
                'addressRegion' => 'Jawa Tengah',
                'addressCountry' => 'ID',
            ],
        ];
    }

    /**
     * Skema Berita / Artikel Berita.
     *
     * @param  array<string, mixed>|null  $formatted
     * @return array<string, mixed>
     */
    public static function newsArticle(Article $article, ?array $formatted = null): array
    {
        $translation = $article->translation();
        $title = $formatted['title'] ?? ($translation ? $translation->title : 'Berita');
        $excerpt = $formatted['excerpt'] ?? ($translation ? $translation->excerpt : '');
        $thumbnail = $formatted['thumbnail'] ?? ($article->getFirstMediaUrl('thumbnail') ?: url('/images/og-default.jpg'));
        $user = $article->user;
        $authorName = $formatted['author']['name'] ?? ($user instanceof User ? $user->name : 'Admin');
        $url = route('berita.show', ['article' => $article->slug]);

        return [
            '@context' => 'https://schema.org',
            '@type' => 'NewsArticle',
            'headline' => $title,
            'description' => $excerpt,
            'image' => [$thumbnail],
            'datePublished' => $article->published_at ? $article->published_at->toIso8601String() : null,
            'dateModified' => $article->updated_at ? $article->updated_at->toIso8601String() : null,
            'author' => [
                '@type' => 'Person',
                'name' => $authorName,
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => Pengaturan::get('site_name', 'SMK Muhammadiyah Bligo'),
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => url('/images/logo.png'),
                ],
            ],
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => $url,
            ],
        ];
    }

    /**
     * Skema Agenda / Acara (Event).
     *
     * @param  array<string, mixed>|null  $formatted
     * @return array<string, mixed>
     */
    public static function event(Agenda $agenda, ?array $formatted = null): array
    {
        $translation = $agenda->translation();
        $judul = $formatted['judul'] ?? ($translation ? $translation->judul : 'Agenda Sekolah');
        $deskripsi = $formatted['deskripsi'] ?? ($translation ? $translation->deskripsi : '');
        $lokasi = $formatted['lokasi'] ?? ($translation && ! empty($translation->lokasi) ? $translation->lokasi : 'SMK Muhammadiyah Bligo');
        $url = route('agenda.show', ['agenda' => $agenda->slug]);

        $startDate = $agenda->tanggal_mulai->toIso8601String();
        $endDate = $agenda->tanggal_selesai ? $agenda->tanggal_selesai->toIso8601String() : $startDate;

        return [
            '@context' => 'https://schema.org',
            '@type' => 'Event',
            'name' => $judul,
            'description' => strip_tags($deskripsi),
            'startDate' => $startDate,
            'endDate' => $endDate,
            'eventStatus' => 'https://schema.org/EventScheduled',
            'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
            'location' => [
                '@type' => 'Place',
                'name' => $lokasi,
                'address' => [
                    '@type' => 'PostalAddress',
                    'streetAddress' => Pengaturan::get('site_address', 'Jl. Raya Bligo, Buaran'),
                    'addressLocality' => 'Pekalongan',
                    'addressRegion' => 'Jawa Tengah',
                    'addressCountry' => 'ID',
                ],
            ],
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => $url,
            ],
        ];
    }

    /**
     * Skema Tanya Jawab (FAQPage).
     *
     * @param  array<int, array{pertanyaan: string, jawaban: string}>  $items
     * @return array<string, mixed>
     */
    public static function faqPage(array $items): array
    {
        $mainEntity = [];
        foreach ($items as $item) {
            $mainEntity[] = [
                '@type' => 'Question',
                'name' => $item['pertanyaan'],
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => strip_tags($item['jawaban']),
                ],
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => $mainEntity,
        ];
    }

    /**
     * Skema Breadcrumb (BreadcrumbList).
     *
     * @param  array<int, array{name: string, url: string}>  $crumbs
     * @return array<string, mixed>
     */
    public static function breadcrumbList(array $crumbs): array
    {
        $itemListElement = [];
        foreach ($crumbs as $index => $crumb) {
            $itemListElement[] = [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $crumb['name'],
                'item' => $crumb['url'],
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => $itemListElement,
        ];
    }

    /**
     * Skema Galeri Foto (ImageGallery).
     *
     * @param  array<string, mixed>|null  $formatted
     * @return array<string, mixed>
     */
    public static function imageGallery(Galeri $galeri, ?array $formatted = null): array
    {
        $translation = $galeri->translation();
        $title = $formatted['title'] ?? ($translation ? $translation->title : 'Galeri Foto');
        $desc = $formatted['description'] ?? ($translation ? $translation->description : '');
        $url = route('galeri.show', ['galeri' => $galeri->slug]);

        return [
            '@context' => 'https://schema.org',
            '@type' => 'ImageGallery',
            'name' => $title,
            'description' => strip_tags($desc),
            'url' => $url,
        ];
    }

    /**
     * Skema Jurusan / Course / EducationalOccupationalProgram.
     *
     * @param  array<string, mixed>|null  $formatted
     * @return array<string, mixed>
     */
    public static function programKeahlian(Jurusan $jurusan, ?array $formatted = null): array
    {
        $translation = $jurusan->translation();
        $nama = $formatted['nama'] ?? ($translation ? $translation->nama : 'Program Keahlian');
        $deskripsi = $formatted['deskripsi'] ?? ($translation ? $translation->deskripsi_singkat : '');
        $url = route('jurusan.show', ['jurusan' => $jurusan->slug]);

        return [
            '@context' => 'https://schema.org',
            '@type' => 'EducationalOccupationalProgram',
            'name' => $nama,
            'description' => strip_tags($deskripsi),
            'url' => $url,
            'provider' => [
                '@type' => 'EducationalOrganization',
                'name' => Pengaturan::get('site_name', 'SMK Muhammadiyah Bligo'),
            ],
        ];
    }

    /**
     * Skema Prestasi (Achievement / Thing).
     *
     * @param  array<string, mixed>|null  $formatted
     * @return array<string, mixed>
     */
    public static function achievement(Prestasi $prestasi, ?array $formatted = null): array
    {
        $judul = $formatted['judul'] ?? ($prestasi->judul ?? 'Prestasi');
        $ringkasan = $formatted['ringkasan'] ?? ($prestasi->ringkasan ?? '');
        $url = route('prestasi.show', ['prestasi' => $prestasi->slug]);

        return [
            '@context' => 'https://schema.org',
            '@type' => 'Achievement',
            'name' => $judul,
            'description' => strip_tags($ringkasan),
            'url' => $url,
        ];
    }
}

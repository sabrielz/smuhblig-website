<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaUsage
{
    /**
     * Cek apakah suatu record Media sedang terpakai (BR-030).
     *
     * Media dianggap terpakai bila:
     * (a) Melekat pada model yang masih ada di collection selain unggahan inline editor, atau
     * (b) URL/filename-nya muncul di konten HTML artikel/pengumuman/agenda/konten halaman/FAQ.
     */
    public static function isUsed(Media $media): bool
    {
        // 1. Cek keterikatan model (a)
        if ($media->model_type && $media->model_id) {
            // Jika model induknya ada dan terdaftar di database
            if (class_exists($media->model_type)) {
                /** @var class-string<Model> $modelClass */
                $modelClass = $media->model_type;
                $parentExists = $modelClass::where('id', $media->model_id)->exists();
                if ($parentExists) {
                    return true;
                }
            }
        }

        // 2. Cek apakah URL atau file_name muncul di konten HTML (b)
        $fileName = $media->file_name;
        $url = $media->disk === 'public' ? $media->getUrl() : '';

        // Kumpulkan needle yang akan dicari
        $needles = array_filter([$fileName, $url]);

        foreach ($needles as $needle) {
            // (1) article_translations (content)
            if (DB::table('article_translations')->where('content', 'LIKE', '%'.$needle.'%')->exists()) {
                return true;
            }

            // (2) pengumuman_translations (konten)
            if (DB::table('pengumuman_translations')->where('konten', 'LIKE', '%'.$needle.'%')->exists()) {
                return true;
            }

            // (3) agenda_translations (deskripsi)
            if (DB::table('agenda_translations')->where('deskripsi', 'LIKE', '%'.$needle.'%')->exists()) {
                return true;
            }

            // (4) halaman_konten_translations (value)
            if (DB::table('halaman_konten_translations')->where('value', 'LIKE', '%'.$needle.'%')->exists()) {
                return true;
            }

            // (5) faq_translations (jawaban)
            if (DB::table('faq_translations')->where('jawaban', 'LIKE', '%'.$needle.'%')->exists()) {
                return true;
            }
        }

        return false;
    }
}

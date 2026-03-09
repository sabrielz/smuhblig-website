<?php

namespace App\Services;

use App\Models\NotifikasiAdmin;
use App\Models\User;

class NotifikasiService
{
    /**
     * Kirim notifikasi in-app ke banyak user.
     *
     * @param  array<int>       $userIds   Array of user IDs yang akan menerima notifikasi
     * @param  string           $tipe      e.g. 'artikel_pending', 'pesan_kontak', 'ai_selesai'
     * @param  string           $judul     Judul singkat notifikasi
     * @param  string|null      $pesan     Pesan detail (opsional)
     * @param  string|null      $url       URL navigasi saat notif diklik (opsional)
     * @param  array|null       $data      Data tambahan dalam JSON (opsional)
     */
    public static function kirim(
        array $userIds,
        string $tipe,
        string $judul,
        ?string $pesan = null,
        ?string $url = null,
        ?array $data = null,
    ): void {
        $records = [];
        $now = now();

        foreach (array_unique($userIds) as $userId) {
            $records[] = [
                'user_id'    => $userId,
                'tipe'       => $tipe,
                'judul'      => $judul,
                'pesan'      => $pesan,
                'url'        => $url,
                'data'       => $data ? json_encode($data) : null,
                'dibaca_at'  => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        if (!empty($records)) {
            NotifikasiAdmin::insert($records);
        }
    }

    /**
     * Helper: dapatkan semua user_id yang memiliki role admin atau editor.
     *
     * @return array<int>
     */
    public static function getAdminAndEditorIds(): array
    {
        return User::role(['admin', 'editor'])
            ->where('is_active', true)
            ->pluck('id')
            ->toArray();
    }

    /**
     * Helper: dapatkan semua user_id yang memiliki role admin.
     *
     * @return array<int>
     */
    public static function getAdminIds(): array
    {
        return User::role('admin')
            ->where('is_active', true)
            ->pluck('id')
            ->toArray();
    }
}

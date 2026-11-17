<?php

declare(strict_types=1);

namespace App\Support;

class CategoryColors
{
    /**
     * Daftar token warna kategori (hex) yang selaras dengan palet Tailwind di app.css.
     *
     * @return array<int, array{hex: string, label: string}>
     */
    public static function all(): array
    {
        return [
            ['hex' => '#003f87', 'label' => 'Primary 600 (Navy)'],
            ['hex' => '#1a6cc4', 'label' => 'Primary 400 (Biru)'],
            ['hex' => '#001f4d', 'label' => 'Primary 900 (Navy Gelap)'],
            ['hex' => '#c9a84c', 'label' => 'Gold 500 (Emas)'],
            ['hex' => '#8a6a1c', 'label' => 'Gold 700 (Emas Gelap)'],
            ['hex' => '#2c2c2e', 'label' => 'Neutral 700 (Abu Gelap)'],
            ['hex' => '#636366', 'label' => 'Neutral 500 (Abu Menengah)'],
            ['hex' => '#059669', 'label' => 'Emerald 600 (Hijau)'],
            ['hex' => '#dc2626', 'label' => 'Red 600 (Merah)'],
            ['hex' => '#7c3aed', 'label' => 'Violet 600 (Ungu)'],
        ];
    }

    /**
     * Ambil hanya daftar kode hex.
     *
     * @return array<int, string>
     */
    public static function hexCodes(): array
    {
        return array_column(self::all(), 'hex');
    }
}

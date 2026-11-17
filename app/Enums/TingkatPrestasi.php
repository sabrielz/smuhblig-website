<?php

namespace App\Enums;

enum TingkatPrestasi: string
{
    case SEKOLAH = 'sekolah';
    case KABUPATEN = 'kabupaten';
    case PROVINSI = 'provinsi';
    case NASIONAL = 'nasional';
    case INTERNASIONAL = 'internasional';

    public function label(string $locale = 'id'): string
    {
        return match ($this) {
            self::SEKOLAH => $locale === 'en' ? 'School Level' : 'Tingkat Sekolah',
            self::KABUPATEN => $locale === 'en' ? 'Regency/City Level' : 'Tingkat Kabupaten/Kota',
            self::PROVINSI => $locale === 'en' ? 'Provincial Level' : 'Tingkat Provinsi',
            self::NASIONAL => $locale === 'en' ? 'National Level' : 'Tingkat Nasional',
            self::INTERNASIONAL => $locale === 'en' ? 'International Level' : 'Tingkat Internasional',
        };
    }
}

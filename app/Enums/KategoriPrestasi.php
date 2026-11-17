<?php

namespace App\Enums;

enum KategoriPrestasi: string
{
    case AKADEMIK = 'akademik';
    case NON_AKADEMIK = 'non_akademik';

    public function label(string $locale = 'id'): string
    {
        return match ($this) {
            self::AKADEMIK => $locale === 'en' ? 'Academic' : 'Akademik',
            self::NON_AKADEMIK => $locale === 'en' ? 'Non-Academic' : 'Non-Akademik',
        };
    }
}

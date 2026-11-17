<?php

namespace App\Traits;

use Spatie\Activitylog\Models\Concerns\HasActivity;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

trait LogsActivityTrait
{
    use HasActivity, LogsActivity;

    /**
     * Konfigurasi opsi logging aktivitas (ADR-007).
     * Mencatat atribut fillable saat terjadi perubahan (dirty),
     * serta mengabaikan kolom-kolom sensitif/rahasia.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->dontLogIfAttributesChangedOnly([
                'updated_at',
                'password',
                'remember_token',
                'two_factor_secret',
                'two_factor_recovery_codes',
                'two_factor_confirmed_at',
                'email_password',
            ]);
    }
}

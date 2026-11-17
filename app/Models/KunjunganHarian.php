<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property Carbon|string $tanggal
 * @property string $konten_type
 * @property int $konten_id
 * @property int $jumlah
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class KunjunganHarian extends Model
{
    use HasFactory;

    protected $table = 'kunjungan_harian';

    protected $fillable = [
        'tanggal',
        'konten_type',
        'konten_id',
        'jumlah',
    ];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
            'konten_id' => 'integer',
            'jumlah' => 'integer',
        ];
    }
}

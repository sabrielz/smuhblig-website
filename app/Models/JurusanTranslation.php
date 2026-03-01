<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JurusanTranslation extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'kompetensi' => 'array',
            'prospek_karir' => 'array',
            'fasilitas' => 'array',
            'ai_translated' => 'boolean',
            'reviewed' => 'boolean',
        ];
    }

    /**
     * Get the jurusan that owns the translation.
     */
    public function jurusan(): BelongsTo
    {
        return $this->belongsTo(Jurusan::class);
    }
}

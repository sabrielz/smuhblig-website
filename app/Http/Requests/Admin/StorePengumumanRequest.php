<?php

namespace App\Http\Requests\Admin;

use App\Models\Pengumuman;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePengumumanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Pengumuman::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'judul_id' => ['required', 'string', 'max:255'],
            'judul_en' => ['nullable', 'string', 'max:255'],
            'konten_id' => ['nullable', 'string'],
            'konten_en' => ['nullable', 'string'],
            'tipe' => ['required', 'in:info,penting,urgent'],
            'tanggal_mulai' => ['nullable', 'date'],
            'tanggal_selesai' => ['nullable', 'date', 'after_or_equal:tanggal_mulai'],
            'is_active' => ['boolean'],
        ];
    }
}

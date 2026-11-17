<?php

namespace App\Http\Requests\Admin;

use App\Models\Fasilitas;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreFasilitasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Fasilitas::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'kategori' => ['required', 'in:ruang_praktik,umum,olahraga,ibadah'],
            'urutan' => ['nullable', 'integer'],
            'is_active' => ['boolean'],

            // Translasi ID (Wajib)
            'translations.id.nama' => ['required', 'string', 'max:255'],
            'translations.id.deskripsi' => ['nullable', 'string'],

            // Translasi EN (Opsional)
            'translations.en.nama' => ['nullable', 'string', 'max:255'],
            'translations.en.deskripsi' => ['nullable', 'string'],

            // Foto fasilitas multiple maksimal 8
            'fotos' => ['nullable', 'array', 'max:8'],
            'fotos.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:20480'], // 20 MB max per BR-004
        ];
    }
}

<?php

namespace App\Http\Requests\Admin;

use App\Models\Fasilitas;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateFasilitasRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Fasilitas|null $fasilitas */
        $fasilitas = $this->route('fasilita') ?? $this->route('fasilitas');

        return $fasilitas && $this->user()?->can('update', $fasilitas) ? true : false;
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

            'fotos' => ['nullable', 'array', 'max:8'],
            'fotos.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:20480'],
            'deleted_media_ids' => ['nullable', 'array'],
            'deleted_media_ids.*' => ['integer'],
        ];
    }
}

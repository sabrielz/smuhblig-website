<?php

namespace App\Http\Requests\Admin;

use App\Models\Guru;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreGuruRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Guru::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'max:255'],
            'gelar_depan' => ['nullable', 'string', 'max:50'],
            'gelar_belakang' => ['nullable', 'string', 'max:50'],
            'kelompok' => ['required', 'in:guru,tendik'],
            'jurusan_id' => ['nullable', 'exists:jurusans,id'],
            'urutan' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
            'foto' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],

            // Translasi ID (Wajib)
            'translations.id.jabatan' => ['required', 'string', 'max:255'],
            'translations.id.mapel' => ['nullable', 'string', 'max:255'],

            // Translasi EN (Opsional)
            'translations.en.jabatan' => ['nullable', 'string', 'max:255'],
            'translations.en.mapel' => ['nullable', 'string', 'max:255'],
        ];
    }
}

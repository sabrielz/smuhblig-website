<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEkstrakurikulerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'pembina_guru_id' => ['nullable', 'exists:guru,id'],
            'urutan' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'foto' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'hapus_foto' => ['nullable', 'boolean'],
            'translations' => ['required', 'array'],
            'translations.id' => ['required', 'array'],
            'translations.id.nama' => ['required', 'string', 'max:255'],
            'translations.id.deskripsi' => ['nullable', 'string'],
            'translations.id.jadwal' => ['nullable', 'string', 'max:255'],
            'translations.en' => ['nullable', 'array'],
            'translations.en.nama' => ['nullable', 'string', 'max:255'],
            'translations.en.deskripsi' => ['nullable', 'string'],
            'translations.en.jadwal' => ['nullable', 'string', 'max:255'],
        ];
    }
}

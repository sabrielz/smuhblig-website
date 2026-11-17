<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreFaqRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'kategori' => ['required', 'string', 'in:umum,pendaftaran,akademik,fasilitas'],
            'urutan' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'translations' => ['required', 'array'],
            'translations.id' => ['required', 'array'],
            'translations.id.pertanyaan' => ['required', 'string', 'max:1000'],
            'translations.id.jawaban' => ['required', 'string'],
            'translations.en' => ['nullable', 'array'],
            'translations.en.pertanyaan' => ['nullable', 'string', 'max:1000'],
            'translations.en.jawaban' => ['nullable', 'string'],
        ];
    }
}

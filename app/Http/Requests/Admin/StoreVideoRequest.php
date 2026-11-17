<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreVideoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        // Ekstraksi 11 karakter ID jika user memasukkan URL penuh
        if ($this->has('youtube_id') && is_string($this->input('youtube_id'))) {
            $input = trim($this->input('youtube_id'));
            if (preg_match('/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)?([A-Za-z0-9_-]{11})/i', $input, $matches)) {
                $this->merge(['youtube_id' => $matches[1]]);
            }
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'youtube_id' => ['required', 'string', 'regex:/^[A-Za-z0-9_-]{11}$/'],
            'galeri_id' => ['nullable', 'integer', 'exists:galeri,id'],
            'urutan' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'translations' => ['required', 'array'],
            'translations.id' => ['required', 'array'],
            'translations.id.judul' => ['required', 'string', 'max:255'],
            'translations.en' => ['nullable', 'array'],
            'translations.en.judul' => ['nullable', 'string', 'max:255'],
        ];
    }
}

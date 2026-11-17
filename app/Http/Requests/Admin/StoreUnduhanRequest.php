<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUnduhanRequest extends FormRequest
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
            'kategori' => ['required', 'in:brosur,kalender,formulir,sk,lainnya'],
            'tanggal_terbit' => ['nullable', 'date'],
            'is_active' => ['boolean'],
            'berkas' => [
                'required',
                'file',
                'mimes:pdf,docx,xlsx',
                'mimetypes:application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'max:10240',
            ],
            'translations' => ['required', 'array'],
            'translations.id' => ['required', 'array'],
            'translations.id.judul' => ['required', 'string', 'max:255'],
            'translations.id.deskripsi' => ['nullable', 'string'],
            'translations.en' => ['nullable', 'array'],
            'translations.en.judul' => ['nullable', 'string', 'max:255'],
            'translations.en.deskripsi' => ['nullable', 'string'],
        ];
    }
}

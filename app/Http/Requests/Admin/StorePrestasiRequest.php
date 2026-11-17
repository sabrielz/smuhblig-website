<?php

namespace App\Http\Requests\Admin;

use App\Enums\KategoriPrestasi;
use App\Enums\TingkatPrestasi;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePrestasiRequest extends FormRequest
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
            'tingkat' => ['required', Rule::enum(TingkatPrestasi::class)],
            'kategori' => ['required', Rule::enum(KategoriPrestasi::class)],
            'tahun' => ['required', 'integer', 'min:2000', 'max:2100'],
            'tanggal' => ['nullable', 'date'],
            'jurusan_id' => ['nullable', 'exists:jurusans,id'],
            'is_active' => ['boolean'],
            'foto' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'foto_alt' => ['required_with:foto', 'nullable', 'string', 'max:150'],
            'translations' => ['required', 'array'],
            'translations.id' => ['required', 'array'],
            'translations.id.judul' => ['required', 'string', 'max:255'],
            'translations.id.ringkasan' => ['nullable', 'string'],
            'translations.en' => ['nullable', 'array'],
            'translations.en.judul' => ['nullable', 'string', 'max:255'],
            'translations.en.ringkasan' => ['nullable', 'string'],
        ];
    }
}

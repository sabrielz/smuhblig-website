<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreAgendaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'tanggal_mulai' => ['required', 'date'],
            'tanggal_selesai' => ['nullable', 'date', 'after_or_equal:tanggal_mulai'],
            'tipe' => ['required', 'string', 'in:kegiatan,libur,ujian,penerimaan'],
            'warna' => ['required', 'string', 'regex:/^#[a-fA-F0-9]{6}$/'],
            'is_active' => ['boolean'],

            'translations' => ['required', 'array'],
            'translations.id' => ['required', 'array'],
            'translations.id.judul' => ['required', 'string', 'max:255'],
            'translations.id.deskripsi' => ['nullable', 'string'],
            'translations.id.lokasi' => ['nullable', 'string', 'max:255'],

            'translations.en' => ['nullable', 'array'],
            'translations.en.judul' => ['nullable', 'string', 'max:255', 'required_with:translations.en.deskripsi,translations.en.lokasi'],
            'translations.en.deskripsi' => ['nullable', 'string'],
            'translations.en.lokasi' => ['nullable', 'string', 'max:255'],
        ];
    }
}

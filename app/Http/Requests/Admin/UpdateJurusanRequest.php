<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateJurusanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isStaff() ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'is_active' => ['boolean'],
            'color_start' => ['required', 'string', 'max:7'],
            'color_end' => ['required', 'string', 'max:7'],
            'icon_name' => ['nullable', 'string', 'max:100'],
            'akreditasi' => ['nullable', 'string', 'max:10'],
            'total_siswa' => ['nullable', 'integer'],
            'lama_pendidikan' => ['nullable', 'string', 'max:50'],
            'highlight_1_icon' => ['nullable', 'string', 'max:100'],
            'highlight_2_icon' => ['nullable', 'string', 'max:100'],
            'highlight_3_icon' => ['nullable', 'string', 'max:100'],

            'cover' => ['nullable', 'image', 'max:2048'],
            'gallery' => ['nullable', 'array', 'max:8'],
            'gallery.*' => ['image', 'max:2048'],
            'deleted_gallery_ids' => ['nullable', 'array'],
            'deleted_gallery_ids.*' => ['integer'],

            'id.nama' => ['required', 'string', 'max:255'],
            'id.tagline' => ['nullable', 'string', 'max:255'],
            'id.deskripsi_singkat' => ['nullable', 'string'],
            'id.deskripsi_lengkap' => ['nullable', 'string'],
            'id.konten_hero' => ['nullable', 'string'],
            'id.kompetensi' => ['array'],
            'id.kompetensi.*' => ['string', 'max:255'],
            'id.prospek_karir' => ['array'],
            'id.prospek_karir.*' => ['string', 'max:255'],
            'id.fasilitas' => ['array'],
            'id.fasilitas.*' => ['string', 'max:255'],
            'id.highlight_1_label' => ['nullable', 'string', 'max:255'],
            'id.highlight_2_label' => ['nullable', 'string', 'max:255'],
            'id.highlight_3_label' => ['nullable', 'string', 'max:255'],

            'en.nama' => ['nullable', 'string', 'max:255'],
            'en.tagline' => ['nullable', 'string', 'max:255'],
            'en.deskripsi_singkat' => ['nullable', 'string'],
            'en.deskripsi_lengkap' => ['nullable', 'string'],
            'en.konten_hero' => ['nullable', 'string'],
            'en.kompetensi' => ['array'],
            'en.kompetensi.*' => ['string', 'max:255'],
            'en.prospek_karir' => ['array'],
            'en.prospek_karir.*' => ['string', 'max:255'],
            'en.fasilitas' => ['array'],
            'en.fasilitas.*' => ['string', 'max:255'],
            'en.highlight_1_en' => ['nullable', 'string', 'max:255'],
            'en.highlight_2_en' => ['nullable', 'string', 'max:255'],
            'en.highlight_3_en' => ['nullable', 'string', 'max:255'],
        ];
    }
}

<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTestimoniRequest extends FormRequest
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
            'nama' => ['required', 'string', 'max:255'],
            'peran' => ['required', 'string', 'in:alumni,orang_tua,mitra'],
            'keterangan' => ['required', 'string', 'max:255'],
            'persetujuan_tampil' => ['required', 'boolean'],
            'is_active' => [
                'nullable',
                'boolean',
                function ($attribute, $value, $fail) {
                    if ($value && ! $this->boolean('persetujuan_tampil')) {
                        $fail('Testimoni hanya dapat diaktifkan jika persetujuan tampil telah diberikan.');
                    }
                },
            ],
            'urutan' => ['nullable', 'integer', 'min:0'],
            'translations' => ['required', 'array'],
            'translations.id' => ['required', 'array'],
            'translations.id.kutipan' => ['required', 'string', 'max:1000'],
            'translations.en' => ['nullable', 'array'],
            'translations.en.kutipan' => ['nullable', 'string', 'max:1000'],
            'foto' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:3072'],
            'foto_alt' => ['required_with:foto', 'nullable', 'string', 'max:150'],
        ];
    }
}

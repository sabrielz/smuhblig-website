<?php

namespace App\Http\Requests\Admin;

use App\Models\Galeri;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGaleriRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Galeri|null $galeri */
        $galeri = $this->route('galeri');

        return $galeri !== null && ($this->user()?->can('update', $galeri) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'judul_id' => ['required', 'string', 'max:255'],
            'judul_en' => ['nullable', 'string', 'max:255'],
            'deskripsi_id' => ['nullable', 'string'],
            'deskripsi_en' => ['nullable', 'string'],
            'event_date' => ['nullable', 'date'],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
        ];
    }
}

<?php

namespace App\Http\Requests\Admin;

use App\Models\Galeri;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreGaleriRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Galeri::class) ?? false;
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

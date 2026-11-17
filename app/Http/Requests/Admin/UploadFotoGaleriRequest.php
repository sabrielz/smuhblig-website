<?php

namespace App\Http\Requests\Admin;

use App\Models\Galeri;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UploadFotoGaleriRequest extends FormRequest
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
            'photos' => ['required', 'array', 'max:20'],
            'photos.*' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png,webp',
                'mimetypes:image/jpeg,image/png,image/webp',
                'max:20480', // 20MB max sesuai BR-004
            ],
        ];
    }
}

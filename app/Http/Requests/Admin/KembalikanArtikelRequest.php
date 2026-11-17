<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class KembalikanArtikelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return (bool) ($this->user()?->isAdmin() || $this->user()?->isEditor());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'catatan' => ['required', 'string', 'max:1000'],
        ];
    }

    /**
     * Custom message validation.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'catatan.required' => 'Catatan revisi wajib diisi untuk memberi tahu penulis hal yang perlu diperbaiki.',
            'catatan.max' => 'Catatan revisi maksimal 1000 karakter.',
        ];
    }
}

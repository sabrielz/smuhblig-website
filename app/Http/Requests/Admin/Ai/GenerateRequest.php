<?php

namespace App\Http\Requests\Admin\Ai;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GenerateRequest extends FormRequest
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
            'judul'  => ['required', 'string', 'max:500'],
            'poin'   => ['nullable', 'string', 'max:2000'],
            'nada'   => ['nullable', Rule::in(['Formal', 'Semi-formal', 'Informatif'])],
            'locale' => ['nullable', Rule::in(['Indonesia', 'English'])],
        ];
    }
}

<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateStatistikRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nilai' => ['required', 'integer', 'min:0'],
            'label' => ['required', 'string', 'max:255'],
            'label_en' => ['nullable', 'string', 'max:255'],
            'suffix' => ['nullable', 'string', 'max:5'],
            'is_active' => ['boolean'],
        ];
    }
}

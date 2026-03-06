<?php

namespace App\Http\Requests\Admin\Ai;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TranslateRequest extends FormRequest
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
            'title'         => ['required', 'string', 'max:500'],
            'excerpt'       => ['nullable', 'string', 'max:1000'],
            'content'       => ['required', 'string', 'max:100000'],
            'target_locale' => ['required', Rule::in(['id', 'en'])],
        ];
    }
}

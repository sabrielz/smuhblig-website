<?php

namespace App\Http\Requests\Admin\Ai;

use Illuminate\Foundation\Http\FormRequest;

class AnalyzeSeoRequest extends FormRequest
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
            'title'            => ['required', 'string', 'max:500'],
            'content'          => ['required', 'string', 'max:100000'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ];
    }
}

<?php

namespace App\Http\Requests\Admin\Ai;

use Illuminate\Foundation\Http\FormRequest;

class CorrectRequest extends FormRequest
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
            'html_content' => ['required', 'string', 'max:100000'],
        ];
    }
}

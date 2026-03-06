<?php

namespace App\Http\Requests\Admin\Ai;

use Illuminate\Foundation\Http\FormRequest;

class ReviseRequest extends FormRequest
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
            'text'        => ['required', 'string', 'max:50000'],
            'instruction' => ['required', 'string', 'max:1000'],
        ];
    }
}

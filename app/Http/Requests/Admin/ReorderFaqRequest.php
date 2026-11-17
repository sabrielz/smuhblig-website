<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ReorderFaqRequest extends FormRequest
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
            'orders' => ['required', 'array'],
            'orders.*.id' => ['required', 'integer', 'exists:faq,id'],
            'orders.*.urutan' => ['required', 'integer', 'min:0'],
        ];
    }
}

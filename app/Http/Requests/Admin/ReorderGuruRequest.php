<?php

namespace App\Http\Requests\Admin;

use App\Models\Guru;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ReorderGuruRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', new Guru) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:guru,id'],
            'items.*.urutan' => ['required', 'integer'],
        ];
    }
}

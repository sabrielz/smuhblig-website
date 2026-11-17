<?php

namespace App\Http\Requests\Admin;

use App\Models\Fasilitas;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ReorderFasilitasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', new Fasilitas) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:fasilitas,id'],
            'items.*.urutan' => ['required', 'integer'],
        ];
    }
}

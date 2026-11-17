<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Models\Category;
use App\Support\CategoryColors;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreKategoriRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Category::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name_id' => ['required', 'string', 'max:255'],
            'name_en' => ['nullable', 'string', 'max:255'],
            'description_id' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
            'color' => ['required', 'string', Rule::in(CategoryColors::hexCodes())],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ];
    }
}

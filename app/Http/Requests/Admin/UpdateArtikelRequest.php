<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateArtikelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'status' => ['required', Rule::in(['draft', 'pending_review', 'published', 'archived'])],
            'published_at' => ['nullable', 'date'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'max:2048'], // max 2MB (optional on update)

            // Translations (ID) - Wajib
            'title_id' => ['required', 'string', 'max:500'],
            'excerpt_id' => ['nullable', 'string'],
            'content_id' => ['required', 'string'],

            // Translations (EN) - Opsional
            'title_en' => ['nullable', 'string', 'max:500'],
            'excerpt_en' => ['nullable', 'string'],
            'content_en' => ['nullable', 'string', 'required_with:title_en'],
        ];
    }
}

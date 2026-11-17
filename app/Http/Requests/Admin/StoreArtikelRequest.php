<?php

namespace App\Http\Requests\Admin;

use App\Models\Article;
use App\Models\User;
use App\Support\ArticleWorkflow;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreArtikelRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = $this->user();

        return $user !== null && $user->can('create', Article::class);
    }

    public function rules(): array
    {
        /** @var User $user */
        $user = $this->user();

        return [
            'category_id' => ['required', 'exists:categories,id'],
            'status' => ['required', Rule::in(ArticleWorkflow::allowedStatuses($user))],
            'published_at' => ['nullable', 'date'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'max:2048'], // max 2MB

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

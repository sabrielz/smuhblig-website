<?php

namespace App\Http\Requests\Admin;

use App\Models\Article;
use App\Models\User;
use App\Support\ArticleWorkflow;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateArtikelRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = $this->user();
        /** @var Article|null $artikel */
        $artikel = $this->route('artikel');

        return $user !== null && $artikel !== null && $user->can('update', $artikel);
    }

    public function rules(): array
    {
        /** @var User $user */
        $user = $this->user();
        /** @var Article|null $artikel */
        $artikel = $this->route('artikel');

        return [
            'category_id' => ['required', 'exists:categories,id'],
            'status' => ['required', Rule::in(ArticleWorkflow::allowedStatuses($user, $artikel))],
            'published_at' => ['nullable', 'date'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'thumbnail' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,webp',
                'mimetypes:image/jpeg,image/png,image/webp',
                'max:2048',
            ], // max 2MB (optional on update)

            // Translations (ID) - Wajib
            'title_id' => ['required', 'string', 'max:500'],
            'excerpt_id' => ['nullable', 'string'],
            'content_id' => ['required', 'string'],

            // Translations (EN) - Opsional
            'title_en' => ['nullable', 'string', 'max:500'],
            'excerpt_en' => ['nullable', 'string'],
            'content_en' => ['nullable', 'string', 'required_with:title_en'],

            // Tags (Maksimal 10 tag, setiap tag max 40 karakter)
            'tags' => ['nullable', 'array', 'max:10'],
            'tags.*' => ['string', 'max:40'],
        ];
    }
}

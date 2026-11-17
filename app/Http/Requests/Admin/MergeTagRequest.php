<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class MergeTagRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && ($user->isAdmin() || $user->isEditor());
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'source_id' => ['required', 'integer', 'exists:tags,id'],
            'target_id' => ['required', 'integer', 'exists:tags,id', 'different:source_id'],
        ];
    }
}

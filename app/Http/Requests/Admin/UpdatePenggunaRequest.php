<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdatePenggunaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var User|null $pengguna */
        $pengguna = $this->route('pengguna');
        $userId = $pengguna instanceof User ? $pengguna->id : $this->route('pengguna');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($userId)],
            'password' => ['nullable', Password::defaults()],
            'role' => ['required', 'string', 'in:admin,editor,author'],
            'is_active' => ['boolean'],
        ];
    }
}

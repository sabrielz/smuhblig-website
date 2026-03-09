<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class StorePesanKontakRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nama'           => ['required', 'string', 'min:3', 'max:255'],
            'email'          => ['required', 'email', 'max:255'],
            'nomor_telepon'  => ['nullable', 'string', 'max:20'],
            'subjek'         => ['required', 'string', 'min:5', 'max:255'],
            'pesan'          => ['required', 'string', 'min:20', 'max:5000'],
            // Honeypot — should always be empty
            'website'        => ['nullable', 'string', 'max:0'],
        ];
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama.required'    => 'Nama wajib diisi.',
            'nama.min'         => 'Nama minimal 3 karakter.',
            'email.required'   => 'Email wajib diisi.',
            'email.email'      => 'Format email tidak valid.',
            'subjek.required'  => 'Subjek wajib diisi.',
            'subjek.min'       => 'Subjek minimal 5 karakter.',
            'pesan.required'   => 'Pesan wajib diisi.',
            'pesan.min'        => 'Pesan minimal 20 karakter.',
            'pesan.max'        => 'Pesan maksimal 5.000 karakter.',
        ];
    }
}

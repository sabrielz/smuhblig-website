<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengaturan extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'label',
        'group',
    ];

    /**
     * Interact with the setting's value, casting based on type.
     */
    protected function value(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => match ($attributes['type'] ?? 'string') {
                'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
                'json' => json_decode($value, true),
                default => $value,
            },
            set: fn (mixed $value) => match ($this->type ?? 'string') {
                'boolean' => $value ? 'true' : 'false',
                'json' => is_array($value) ? json_encode($value) : $value,
                default => (string) $value,
            }
        );
    }

    /**
     * Get a setting value by key.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = self::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Set or update a setting value.
     */
    public static function set(string $key, mixed $value): void
    {
        $setting = self::where('key', $key)->first();
        if ($setting) {
            $setting->update(['value' => $value]);
        }
    }

    /**
     * Get all settings in a specific group.
     */
    public static function getGroup(string $group): array
    {
        $settings = self::where('group', $group)->get();
        return $settings->pluck('value', 'key')->toArray();
    }

    /**
     * Get all settings as a flat key => value array.
     */
    public static function getAllSettings(): array
    {
        return self::all()->pluck('value', 'key')->toArray();
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $keys = [
            'fitur_artikel_approval' => 'artikel_approval',
            'fitur_artikel_ai_enabled' => 'artikel_ai_enabled',
            'fitur_multibahasa_enabled' => 'multibahasa_enabled',
        ];

        foreach ($keys as $oldKey => $newKey) {
            $oldRow = DB::table('pengaturans')->where('key', $oldKey)->first();
            if ($oldRow) {
                $newRow = DB::table('pengaturans')->where('key', $newKey)->first();
                if (! $newRow) {
                    DB::table('pengaturans')->insert([
                        'key' => $newKey,
                        'value' => $oldRow->value,
                        'type' => $oldRow->type ?? 'boolean',
                        'label' => $oldRow->label ?? $newKey,
                        'group' => 'fitur',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
                DB::table('pengaturans')->where('key', $oldKey)->delete();
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // down() tidak perlu mengembalikan karena key fitur_* adalah penamaan usang
    }
};

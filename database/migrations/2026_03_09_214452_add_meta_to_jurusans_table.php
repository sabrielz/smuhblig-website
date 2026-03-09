<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('jurusans', function (Blueprint $table) {
            $table->string('akreditasi', 10)->nullable();
            $table->integer('total_siswa')->default(0);
            $table->string('lama_pendidikan', 50)->default('3 Tahun');
            $table->string('highlight_1_icon', 100)->nullable();
            $table->string('highlight_2_icon', 100)->nullable();
            $table->string('highlight_3_icon', 100)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jurusans', function (Blueprint $table) {
            $table->dropColumn([
                'akreditasi',
                'total_siswa',
                'lama_pendidikan',
                'highlight_1_icon',
                'highlight_2_icon',
                'highlight_3_icon'
            ]);
        });
    }
};

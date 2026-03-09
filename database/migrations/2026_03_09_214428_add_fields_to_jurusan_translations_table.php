<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('jurusan_translations', function (Blueprint $table) {
            $table->text('konten_hero')->nullable();
            $table->string('highlight_1_label')->nullable();
            $table->string('highlight_2_label')->nullable();
            $table->string('highlight_3_label')->nullable();
            $table->string('highlight_1_en')->nullable();
            $table->string('highlight_2_en')->nullable();
            $table->string('highlight_3_en')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jurusan_translations', function (Blueprint $table) {
            $table->dropColumn([
                'konten_hero',
                'highlight_1_label',
                'highlight_2_label',
                'highlight_3_label',
                'highlight_1_en',
                'highlight_2_en',
                'highlight_3_en'
            ]);
        });
    }
};

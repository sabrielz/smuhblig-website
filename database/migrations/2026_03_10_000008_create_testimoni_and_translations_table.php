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
        Schema::create('testimoni', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->enum('peran', ['alumni', 'orang_tua', 'mitra'])->default('alumni');
            $table->string('keterangan'); // mis. "Alumni TKJ 2022", "Orang Tua Siswa", "HRD PT ..."
            $table->boolean('persetujuan_tampil')->default(false)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->unsignedInteger('urutan')->default(0)->index();
            $table->timestamps();
        });

        Schema::create('testimoni_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('testimoni_id')->constrained('testimoni')->cascadeOnDelete();
            $table->string('locale', 10);
            $table->text('kutipan');
            $table->boolean('ai_translated')->default(false);
            $table->boolean('reviewed')->default(false);
            $table->timestamps();

            $table->unique(['testimoni_id', 'locale']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testimoni_translations');
        Schema::dropIfExists('testimoni');
    }
};

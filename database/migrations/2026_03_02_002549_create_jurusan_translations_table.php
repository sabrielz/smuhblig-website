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
        Schema::create('jurusan_translations', function (Blueprint $table) {
            $table->id(); // BIGSERIAL PRIMARY KEY
            // jurusan_id BIGINT REFERENCES jurusans(id) ON DELETE CASCADE
            $table->foreignId('jurusan_id')->constrained('jurusans')->cascadeOnDelete();

            $table->string('locale', 10);
            $table->string('nama', 255);
            $table->string('tagline', 500)->nullable();
            $table->text('deskripsi_singkat')->nullable();
            $table->longText('deskripsi_lengkap')->nullable();
            $table->json('kompetensi')->nullable();
            $table->json('prospek_karir')->nullable();
            $table->json('fasilitas')->nullable();
            $table->boolean('ai_translated')->default(false);
            $table->boolean('reviewed')->default(false);
            $table->timestamps();

            // UNIQUE(jurusan_id, locale)
            $table->unique(['jurusan_id', 'locale']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jurusan_translations');
    }
};

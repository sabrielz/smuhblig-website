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
        Schema::create('prestasi', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->enum('tingkat', ['sekolah', 'kabupaten', 'provinsi', 'nasional', 'internasional'])->default('kabupaten');
            $table->enum('kategori', ['akademik', 'non_akademik'])->default('non_akademik');
            $table->smallInteger('tahun')->index();
            $table->date('tanggal')->nullable();
            $table->foreignId('jurusan_id')->nullable()->constrained('jurusans')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'tahun']);
        });

        Schema::create('prestasi_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestasi_id')->constrained('prestasi')->cascadeOnDelete();
            $table->string('locale', 10);
            $table->string('judul');
            $table->text('ringkasan')->nullable();
            $table->boolean('ai_translated')->default(false);
            $table->boolean('reviewed')->default(false);
            $table->timestamps();

            $table->unique(['prestasi_id', 'locale']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestasi_translations');
        Schema::dropIfExists('prestasi');
    }
};

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
        Schema::create('galeri_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('galeri_id')->constrained('galeri')->onDelete('cascade');
            $table->string('locale', 10);
            $table->string('judul', 500);
            $table->text('deskripsi')->nullable();
            $table->boolean('ai_translated')->default(false);
            $table->boolean('reviewed')->default(false);
            $table->timestamps();

            $table->unique(['galeri_id', 'locale']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('galeri_translations');
    }
};

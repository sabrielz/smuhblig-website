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
        Schema::create('halaman_konten_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('halaman_konten_id')->constrained('halaman_kontens')->cascadeOnDelete();
            $table->string('locale', 10);
            $table->text('value')->nullable();
            $table->boolean('ai_translated')->default(false);
            $table->boolean('reviewed')->default(false);
            $table->timestamps();

            $table->unique(['halaman_konten_id', 'locale']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('halaman_konten_translations');
    }
};

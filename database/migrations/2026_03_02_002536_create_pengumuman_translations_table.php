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
        Schema::create('pengumuman_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengumuman_id')->constrained('pengumuman')->onDelete('cascade');
            $table->string('locale', 10);
            $table->string('judul', 500);
            $table->text('konten');
            $table->boolean('ai_translated')->default(false);
            $table->boolean('reviewed')->default(false);
            $table->timestamps();

            $table->unique(['pengumuman_id', 'locale']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengumuman_translations');
    }
};

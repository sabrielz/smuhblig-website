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
        Schema::create('ekstrakurikuler', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->foreignId('pembina_guru_id')->nullable()->constrained('guru')->nullOnDelete();
            $table->integer('urutan')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('ekstrakurikuler_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ekstrakurikuler_id')->constrained('ekstrakurikuler')->cascadeOnDelete();
            $table->string('locale', 10);
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->string('jadwal')->nullable();
            $table->boolean('ai_translated')->default(false);
            $table->boolean('reviewed')->default(false);
            $table->timestamps();

            $table->unique(['ekstrakurikuler_id', 'locale']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ekstrakurikuler_translations');
        Schema::dropIfExists('ekstrakurikuler');
    }
};

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
        Schema::create('unduhan', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->enum('kategori', ['brosur', 'kalender', 'formulir', 'sk', 'lainnya'])->default('lainnya');
            $table->date('tanggal_terbit')->nullable();
            $table->unsignedInteger('jumlah_unduh')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('unduhan_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unduhan_id')->constrained('unduhan')->cascadeOnDelete();
            $table->string('locale', 10);
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->boolean('ai_translated')->default(false);
            $table->boolean('reviewed')->default(false);
            $table->timestamps();

            $table->unique(['unduhan_id', 'locale']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unduhan_translations');
        Schema::dropIfExists('unduhan');
    }
};

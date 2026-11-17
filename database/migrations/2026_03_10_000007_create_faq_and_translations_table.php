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
        Schema::create('faq', function (Blueprint $table) {
            $table->id();
            $table->enum('kategori', ['umum', 'pendaftaran', 'akademik', 'fasilitas'])->default('umum')->index();
            $table->unsignedInteger('urutan')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('faq_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faq_id')->constrained('faq')->cascadeOnDelete();
            $table->string('locale', 10);
            $table->text('pertanyaan');
            $table->text('jawaban');
            $table->boolean('ai_translated')->default(false);
            $table->boolean('reviewed')->default(false);
            $table->timestamps();

            $table->unique(['faq_id', 'locale']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faq_translations');
        Schema::dropIfExists('faq');
    }
};

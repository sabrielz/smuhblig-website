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
        Schema::create('halaman_kontens', function (Blueprint $table) {
            $table->id();
            $table->string('halaman', 100);
            $table->string('section', 100);
            $table->string('key', 255);
            $table->string('type', 50)->default('text');
            $table->string('label', 255)->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['halaman', 'section', 'key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('halaman_kontens');
    }
};

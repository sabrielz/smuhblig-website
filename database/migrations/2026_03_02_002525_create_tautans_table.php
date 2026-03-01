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
        Schema::create('tautan', function (Blueprint $table) {
            $table->id();
            $table->string('label', 255);
            $table->string('label_en', 255)->nullable();
            $table->text('url');
            $table->text('deskripsi')->nullable();
            $table->text('deskripsi_en')->nullable();
            $table->string('icon_name', 100)->nullable();
            $table->string('kategori', 100)->nullable(); // pendaftaran, akademik, sosial, lainnya
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->boolean('buka_tab_baru')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tautan');
    }
};

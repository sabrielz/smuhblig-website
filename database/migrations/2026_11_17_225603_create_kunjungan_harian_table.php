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
        Schema::create('kunjungan_harian', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->string('konten_type');
            $table->unsignedBigInteger('konten_id');
            $table->unsignedInteger('jumlah')->default(1);
            $table->timestamps();

            $table->unique(['tanggal', 'konten_type', 'konten_id'], 'kunjungan_harian_unik');
            $table->index(['tanggal', 'konten_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kunjungan_harian');
    }
};

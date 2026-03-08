<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pesan_kontak', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 255);
            $table->string('email', 255);
            $table->string('nomor_telepon', 20)->nullable();
            $table->string('subjek', 255);
            $table->text('pesan');
            $table->string('status', 50)->default('baru'); // baru, dibaca, dibalas, diarsip
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('dibaca_at')->nullable();
            $table->foreignId('dibaca_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            // Indexes
            $table->index('status');
            $table->index('created_at'); // Descending is usually implicitly handled by the DB engine, but we add an index here
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesan_kontak');
    }
};

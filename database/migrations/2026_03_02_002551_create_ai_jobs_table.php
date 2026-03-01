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
        Schema::create('ai_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('job_type', 100); // generate, revise, correct, translate, seo
            $table->nullableMorphs('model'); // Adds model_type and model_id
            $table->text('input')->nullable();
            $table->text('output')->nullable();
            $table->string('status', 50)->default('pending'); // pending, processing, done, failed
            $table->text('error_message')->nullable();
            $table->integer('tokens_used')->nullable();
            $table->integer('duration_ms')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_jobs');
    }
};

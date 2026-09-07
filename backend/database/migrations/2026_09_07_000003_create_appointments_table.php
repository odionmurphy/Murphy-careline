<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedBigInteger('doctor_id');
            $table->string('doctor_name');
            $table->string('specialty');
            $table->dateTime('scheduled_at');
            $table->enum('status', ['Confirmed', 'Pending', 'Completed', 'Cancelled'])->default('Pending');
            $table->enum('mode', ['Video consultation', 'In clinic'])->default('Video consultation');
            $table->timestamps();

            $table->index(['patient_id', 'scheduled_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};

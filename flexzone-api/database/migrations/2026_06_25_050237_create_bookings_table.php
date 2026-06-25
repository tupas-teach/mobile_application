<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('court_id');
            $table->string('court_name');
            $table->date('date');
            $table->json('time_slots');
            $table->decimal('duration', 5, 1);
            $table->string('category');
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->enum('payment_status', ['pending', 'paid', 'unpaid', 'refunded', 'failed', 'success'])->default('unpaid');
            $table->enum('payment_method', ['gcash', 'maya', 'credit_card', 'cash'])->nullable();
            $table->text('notes')->nullable();
            $table->integer('guest_count')->nullable();
            $table->string('event_type')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
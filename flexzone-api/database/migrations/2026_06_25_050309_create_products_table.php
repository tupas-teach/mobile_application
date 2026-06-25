<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category');
            $table->decimal('price', 10, 2);
            $table->string('image')->nullable();
            $table->decimal('rating', 3, 1)->default(0);
            $table->integer('reviews')->default(0);
            $table->boolean('in_stock')->default(true);
            $table->text('description')->nullable();
            $table->boolean('for_gym')->default(false);
            $table->boolean('for_court')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

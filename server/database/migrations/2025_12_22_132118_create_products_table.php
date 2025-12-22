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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique()->after('id');
            $table->integer('barcode');
            $table->string('title')->unique();
            $table->string('description');
            $table->integer('wholesale_price');
            $table->integer('selling_price');
            $table->integer('category_id');
            $table->integer('sub_category');
            $table->integer('mini_category');
            $table->string('image_url');
            $table->string('image_url_2');
            $table->integer('stock_quantity');
            $table->integer('active')->nullable();
            $table->string('meta_title');
            $table->string('meta_description');
            $table->string('meta_keywords');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

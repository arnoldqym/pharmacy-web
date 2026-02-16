<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {


    public function up(): void
    {
        //categories table
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->nullable();
            $table->string('active')->nullable();
            $table->timestamps();
        });
        Schema::create('sub_category', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('caption')->nullable();
            $table->string('category_id')->nullable();
            $table->string('active')->nullable();
            $table->timestamps();
        });

        // products table
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
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

        Schema::create('cart', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('product_id')->constrained();
            $table->integer('quantity')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
        Schema::dropIfExists('sub_category');
        Schema::dropIfExists('products');

    }
};

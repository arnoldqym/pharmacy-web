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
        Schema::create('drugs', function (Blueprint $table) {
            $table->id();
            $table->string('ndc', 50)->unique()->comment('National Drug Code or internal SKU');
            $table->string('brand_name', 255);
            $table->string('generic_name', 255)->nullable();
            $table->string('manufacturer', 255);
            $table->string('dosage_form', 50)->nullable(); // e.g., Tablet, Capsule
            $table->string('strength', 50); // e.g., "500 mg"
            $table->integer('package_size'); // units per pack
            $table->string('uom', 20); // unit of measure (tablets, ml, etc.)
            $table->decimal('selling_price', 10, 2);
            $table->string('rx_status', 3)->default('Rx')->comment('Rx or OTC');
            $table->string('schedule', 3)->nullable()->comment('CII, CIII, CIV, CV');
            $table->string('storage', 255)->nullable();
            $table->integer('min_stock_level')->default(0);
            $table->string('location', 50)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drugs');
    }
};

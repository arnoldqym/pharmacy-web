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
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('drug_id')
                ->constrained()
                ->onDelete('cascade')
                ->comment('References the drugs table');
            $table->string('batch_no', 100);
            $table->date('expiry_date');
            $table->integer('quantity')->default(0);
            $table->decimal('cost_price', 10, 2);
            $table->timestamps();

            // Ensure each batch is unique per drug
            $table->unique(['drug_id', 'batch_no'], 'unique_drug_batch');

            // Speed up queries filtering by expiry
            $table->index('expiry_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batches');
    }
};

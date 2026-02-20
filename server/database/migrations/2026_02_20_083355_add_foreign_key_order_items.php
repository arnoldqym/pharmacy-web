<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        // Ensure batches table has batch_no column and unique index
        Schema::table('batches', function (Blueprint $table) {
            if (!Schema::hasColumn('batches', 'batch_no')) {
                $table->string('batch_no')->unique();
            }
            // Do NOT add unique again if it already exists
        });

        // Add new foreign key relationship
        Schema::table('order_items', function (Blueprint $table) {
            $table->foreign('batch_no')
                ->references('batch_no')
                ->on('batches')
                ->onDelete('restrict');
        });
    }

    public function down()
    {
        Schema::table('order_items', function (Blueprint $table) {
            // Drop only if it exists
            $table->dropForeign(['batch_no']);
        });

        // Drop unique index only if it exists
        Schema::table('batches', function (Blueprint $table) {
            $table->dropUnique('batches_batch_no_unique');
        });
    }
};



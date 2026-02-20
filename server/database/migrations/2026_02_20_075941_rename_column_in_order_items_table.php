<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->renameColumn('batch_id', 'batch_no');
            $table->string('batch_no')->change();
        });
    }
    //reverse migration
    public function down()
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->renameColumn('batch_no', 'batch_id');
        });
    }
};

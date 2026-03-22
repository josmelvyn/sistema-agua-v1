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
    Schema::table('pedidos', function (Blueprint $table) {
        $table->integer('envases_entregados')->default(0); // Llenos
        $table->integer('envases_recogidos')->default(0);  // Vacíos devueltos
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            //
        });
    }
};

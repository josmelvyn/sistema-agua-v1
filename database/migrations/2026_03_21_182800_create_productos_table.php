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
        Schema::create('productos', function (Blueprint $table) {
    $table->id();
    $table->string('nombre'); 
    $table->decimal('precio_regular', 10, 2);
    $table->integer('stock_actual')->default(0);

    // Lógica de Bonificación (Ej: 10 + 1)
    $table->integer('cantidad_minima_bono')->default(0); // El "10"
    $table->integer('cantidad_regalo')->default(0);      // El "1"
    
    // Por si quieres manejar un precio especial ADEMÁS del regalo
    $table->decimal('precio_oferta', 10, 2)->nullable(); 
    
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};

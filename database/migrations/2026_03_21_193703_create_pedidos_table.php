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
  Schema::create('pedidos', function (Blueprint $table) {
    $table->id();
    $table->foreignId('punto_venta_id')->constrained('punto_ventas');
    
    // --- AÑADE ESTAS DOS LÍNEAS ---
    $table->foreignId('producto_id')->constrained('productos'); 
    $table->integer('cantidad');
    // ------------------------------

    $table->foreignId('chofer_id')->nullable()->constrained('choferes');
    $table->foreignId('ruta_id')->nullable()->constrained('rutas');
    $table->enum('tipo', ['preventa', 'venta_directa'])->default('preventa');
    $table->enum('estado', ['pendiente', 'en_camino', 'entregado', 'cancelado'])->default('pendiente');
    $table->decimal('subtotal', 12, 2);
    $table->decimal('descuento_bono', 12, 2)->default(0);
    $table->decimal('total', 12, 2);
    $table->boolean('pagado')->default(false);
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};

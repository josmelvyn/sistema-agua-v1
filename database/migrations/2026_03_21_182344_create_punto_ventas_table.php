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
        Schema::create('punto_ventas', function (Blueprint $table) {
    $table->id();
    $table->string('nombre_negocio');
    $table->string('dueño');
    $table->string('cedula_rnc')->unique()->nullable(); // Identificación fiscal
    $table->string('telefono');
    $table->string('direccion');
    
    // Geolocalización
    $table->decimal('latitud', 10, 8)->nullable();
    $table->decimal('longitud', 11, 8)->nullable();
    
    // Estado y Finanzas
    $table->boolean('esta_activo')->default(true); // Para suspender clientes
    $table->decimal('limite_credito', 12, 2)->default(0); // Límite de dinero
    $table->decimal('saldo_actual', 12, 2)->default(0); // Lo que debe hoy
    
    // Activos de la empresa en el local
    $table->integer('envases_prestados')->default(0);
    $table->boolean('tiene_anaquel')->default(false);
    $table->integer('capacidad_anaquel')->nullable(); // Cantidad de botellones que caben
   $table->foreignId('ruta_id')->constrained('rutas'); // <--- AGREGA ESTA LÍNEA

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('punto_ventas');
    }
};

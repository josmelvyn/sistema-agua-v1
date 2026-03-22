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
      Schema::create('rutas', function (Blueprint $table) {
    $table->id();
    $table->string('nombre_ruta'); // Ejemplo: "Ruta 01 - Centro"
    $table->string('dia_visita')->nullable(); // Ejemplo: "Lunes y Jueves"
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rutas');
    }
};

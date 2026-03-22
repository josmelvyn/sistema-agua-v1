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
        Schema::create('despachos', function (Blueprint $table) {
             $table->id();
            $table->foreignId('chofer_id')->constrained('choferes');
            $table->foreignId('ruta_id')->constrained('rutas');
            $table->string('placa_vehiculo');
            $table->integer('cantidad_botellones_salida'); // Total que lleva el camión
            $table->enum('estado', ['en_ruta', 'completado', 'cancelado'])->default('en_ruta');
            $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('despachos');
    }
};

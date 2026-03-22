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
       Schema::create('choferes', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relación con la tabla de usuarios (login)
    $table->string('licencia_conducir')->nullable();
    $table->string('placa_vehiculo')->nullable();
   $table->foreignId('ruta_id')->nullable()->constrained('rutas')->onDelete('set null');
    $table->boolean('esta_en_ruta')->default(false);
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('choferes');
    }
};

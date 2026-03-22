<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
// Importante: Asegúrate de que el modelo Producto esté en app/Models
use App\Models\Producto; 

class ProductoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ejemplo: Botellón de 5 Galones con oferta 10 + 1
        Producto::create([
            'nombre' => 'Botellón 5 Galones',
            'precio_regular' => 100.00,
            'stock_actual' => 500,
            'cantidad_minima_bono' => 10,
            'cantidad_regalo' => 1,
        ]);
    }
}

<?php
namespace App\Models; // <--- FALTA ESTA LÍNEA

use Illuminate\Database\Eloquent\Model; // <--- Y ESTA TAMBIÉN
class Producto extends Model
{
    protected $fillable = [
        'nombre', 
        'precio_regular', 
        'stock_actual',
        'cantidad_minima_bono', 
        'cantidad_regalo'
    ];

    // Función para calcular cuántos regalos tocan
    public function calcularRegalo($cantidadPedida) {
        if ($this->cantidad_minima_bono > 0 && $cantidadPedida >= $this->cantidad_minima_bono) {
            return floor($cantidadPedida / $this->cantidad_minima_bono) * $this->cantidad_regalo;
        }
        return 0;
    }
}
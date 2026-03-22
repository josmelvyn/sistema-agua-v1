<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PuntoVenta extends Model
{
    use HasFactory;

    // Nombre de la tabla en MySQL
    protected $table = 'punto_ventas';

    // Campos que permitimos llenar desde el formulario
    protected $fillable = [
        'nombre_negocio',
        'dueño',
        'cedula_rnc',
        'telefono',
        'direccion',
        'latitud',
        'longitud',
        'esta_activo',
        'limite_credito',
        'saldo_actual',
        'envases_prestados',
        'tiene_anaquel',
        'capacidad_anaquel',
        'ruta_id'
    ];

    // Relación: Un punto de venta pertenece a una ruta
    public function ruta()
    {
        return $this->belongsTo(Ruta::class);
    }
}
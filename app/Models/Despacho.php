<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Despacho extends Model
{
    protected $table = 'despachos';

    protected $fillable = [
    'chofer_id', 
    'ruta_id', 
    'estado', 
    'placa_vehiculo', 
    'cantidad_botellones_salida' // <-- Debe decir esto exactamente
];
    protected $guarded = []; 

    public function pedidos() {
        return $this->hasMany(Pedido::class);
    }
     public function chofer()
    {
        return $this->belongsTo(Chofer::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ruta extends Model
{
protected $fillable = ['nombre_ruta', 'dia_visita'];

    public function puntosDeVenta() {
        return $this->hasMany(PuntoVenta::class);
    }

    public function chofer() {
        return $this->hasOne(Chofer::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chofer extends Model
{
    use HasFactory;

    protected $table = 'choferes'; // Nombre de la tabla en XAMPP

    protected $fillable = [
        'user_id',
        'licencia_conducir',
        'placa_vehiculo',
        'ruta_id',
        'esta_en_ruta'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
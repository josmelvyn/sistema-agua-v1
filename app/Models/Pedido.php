<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $fillable = [
        'punto_venta_id', 
        'chofer_id',
        'ruta_id',
        'despacho_id',
        'tipo',
        'estado',
        'subtotal',
        'descuento_bono',
        'total',
        'pagado'
    ];

    // --- RELACIÓN CON PRODUCTOS (Tabla intermedia pedido_producto) ---
    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'pedido_producto')
                    ->withPivot('cantidad', 'precio_unitario', 'subtotal')
                    ->withTimestamps();
    }

    // Relación con el Cliente (PDV)
    public function puntoVenta()
    {
        return $this->belongsTo(PuntoVenta::class, 'punto_venta_id');
    }

    // Relación con el Chofer
    public function chofer()
    {
        return $this->belongsTo(Chofer::class);
    }
}
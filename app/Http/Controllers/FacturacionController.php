<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacturacionController extends Controller
{
    // 1. ESTE ES EL MÉTODO QUE TE FALTABA PARA VER LA LISTA
    public function index() 
    {
        return Inertia::render('Facturacion/Index', [
            'pedidosPorAprobar' => Pedido::where('estado', 'por_aprobar')
                ->with('puntoVenta')
                ->get()
        ]);
    }

    // 2. Método para aprobar (el que ya tenías)
    public function aprobarYFacturar($id) 
    {
        $pedido = Pedido::findOrFail($id);
        
        $pedido->update([
            'estado' => 'pendiente', 
            'facturado_at' => now(),
            'numero_factura' => 'FAC-' . str_pad($pedido->id, 6, '0', STR_PAD_LEFT),
        ]);

        return redirect()->back()->with('message', '✅ Pedido #' . $pedido->id . ' facturado y enviado a despacho.');
    }
}
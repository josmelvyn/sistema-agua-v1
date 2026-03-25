<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacturacionController extends Controller
{
    // 1. Muestra la lista de pedidos que esperan por oficina
    public function index() 
    {
        return Inertia::render('Facturacion/Index', [
            'pedidosPorAprobar' => Pedido::where('estado', 'por_aprobar')
                 ->with(['puntoVenta', 'productos'])
                ->get()
        ]);
    }

    // 2. Procesa la factura y valida el límite de crédito
    public function aprobarYFacturar($id) 
{
    $pedido = Pedido::with('puntoVenta')->findOrFail($id);
    
    if ($pedido->metodo_pago === 'credito') {
        $cliente = $pedido->puntoVenta;
        $saldoActual = $cliente->saldo_pendiente ?? 0;

        // REGLA 1: Si debe aunque sea 1 peso, NO puede coger más crédito
        if ($saldoActual > 0) {
            return redirect()->back()->with('error', 
                "❌ CLIENTE BLOQUEADO: Debe {$saldoActual}. Debe saldar su deuda actual antes de solicitar nuevo crédito."
            );
        }

        // REGLA 2: Si el pedido nuevo es mayor a su límite (por seguridad extra)
        if ($pedido->total > $cliente->limite_credito) {
            return redirect()->back()->with('error', 
                "❌ MONTO EXCEDIDO: El pedido de {$pedido->total} supera su límite de crédito de {$cliente->limite_credito}."
            );
        }
    }

    // Si es contado o cliente está al día, aprobamos
    $pedido->update([
        'estado' => 'pendiente', 
        'facturado_at' => now(),
        'numero_factura' => 'FAC-' . str_pad($pedido->id, 6, '0', STR_PAD_LEFT),
    ]);

    return redirect()->back()->with('message', '✅ Pedido facturado con éxito.');
}
 public function edit($id)
{
    $pedido = Pedido::with(['puntoVenta', 'productos'])->findOrFail($id);
    $productos = \App\Models\Producto::all();

    return Inertia::render('Facturacion/Edit', [
        'pedido' => $pedido,
        'productos' => $productos
    ]);
}

public function update(Request $request, $id)
{
    $request->validate([
        'items' => 'required|array|min:1',
        'items.*.id' => 'required|exists:productos,id',
        'items.*.cantidad' => 'required|numeric|min:1',
        'items.*.bono' => 'nullable|numeric|min:0',
    ]);

    return \DB::transaction(function () use ($request, $id) {
        $pedido = Pedido::findOrFail($id);
        $totalAcumulado = 0;

        // Limpiamos los productos actuales para insertar los nuevos
        $pedido->productos()->detach();

        foreach ($request->items as $item) {
            $producto = \App\Models\Producto::find($item['id']);
            $subtotal = $producto->precio_regular * $item['cantidad'];
            $totalAcumulado += $subtotal;

            $pedido->productos()->attach($item['id'], [
                'cantidad' => $item['cantidad'],
                'bono' => $item['bono'] ?? 0, // Aquí permites editar el bono manualmente
                'precio_unitario' => $producto->precio_regular,
                'subtotal' => $subtotal,
            ]);
        }

        $pedido->update([
            'total' => $totalAcumulado,
            'subtotal' => $totalAcumulado,
        ]);

        return redirect()->route('facturacion.index')->with('message', '✅ Pedido actualizado correctamente.');
    });
}

}
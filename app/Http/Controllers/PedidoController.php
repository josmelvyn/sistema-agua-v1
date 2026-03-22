<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PuntoVenta;
use App\Models\Producto;
use App\Models\Pedido;
use App\Models\Chofer;

class PedidoController extends Controller
{
    public function create()
    {
        return Inertia::render('Pedidos/Create', [
            'clientes' => PuntoVenta::all(),
            'productos' => Producto::all()
        ]);
    }

public function store(Request $request)
{
    $request->validate([
        'punto_venta_id'    => 'required|exists:punto_ventas,id',
        'metodo_pago'       => 'required|in:contado,credito',
        'entrega_inmediata' => 'required|boolean', // Nuevo campo del formulario
        'items'             => 'required|array|min:1', 
        'items.*.id'        => 'required|exists:productos,id',
        'items.*.cantidad'  => 'required|numeric|min:1',
    ]);

    return \DB::transaction(function () use ($request) {
        $seLoLlevaYa = $request->entrega_inmediata;
        
        // 1. Definir estado inicial
        // Si se lo lleva ya: 'entregado'. Si no: 'por_aprobar' (para que oficina lo vea) 
        // o 'pendiente' (si prefieres que oficina lo mande directo a despacho).
        $estadoInicial = $seLoLlevaYa ? 'entregado' : 'por_aprobar';

        $pedido = \App\Models\Pedido::create([
            'punto_venta_id' => $request->punto_venta_id,
            'metodo_pago'    => $request->metodo_pago,
            'estado'         => $estadoInicial,
            'pagado'         => $seLoLlevaYa, // Si se lo lleva, se asume pagado/procesado
            'subtotal'       => 0,
            'total'          => 0,
        ]);

        $totalAcumulado = 0;

        foreach ($request->items as $item) {
            $producto = \App\Models\Producto::findOrFail($item['id']);
            $precio = $producto->precio_regular;
            $cant = $item['cantidad'];
            $bono = floor($cant / 10); // Lógica 10+1

            $subtotalItem = $precio * $cant;
            $totalAcumulado += $subtotalItem;

            // 2. SI ES ENTREGA INMEDIATA: Descontamos stock ahora mismo
            if ($seLoLlevaYa) {
                $producto->decrement('stock_actual', ($cant + $bono));
            }

            $pedido->productos()->attach($producto->id, [
                'cantidad'        => $cant,
                'precio_unitario' => $precio,
                'subtotal'        => $subtotalItem,
                // Si agregaste la columna 'bono' en la tabla intermedia:
                // 'bono'         => $bono 
            ]);
        }

        $pedido->update([
            'subtotal' => $totalAcumulado,
            'total'    => $totalAcumulado,
        ]);

        $mensaje = $seLoLlevaYa 
            ? 'Venta realizada: Mercancía entregada y stock descontado.' 
            : 'Preventa registrada: Pendiente de autorización en oficina.';

        return redirect()->back()->with('success', $mensaje);
    });
}
    public function liquidacion($chofer_id)
    {
        $hoy = now()->startOfDay();
        $resumen = Pedido::where('chofer_id', $chofer_id)
            ->where('estado', 'entregado')
            ->whereDate('created_at', $hoy)
            ->selectRaw('
                SUM(CASE WHEN pagado = 1 THEN total ELSE 0 END) as total_efectivo,
                SUM(CASE WHEN pagado = 0 THEN total ELSE 0 END) as total_credito,
                COUNT(*) as total_entregas
            ')
            ->first();

        return Inertia::render('Choferes/Liquidacion', [
            'resumen' => $resumen,
            'chofer' => Chofer::with('user')->find($chofer_id)
        ]);
    }
    public function indexChofer()
{
    // Obtenemos los pedidos pendientes con los datos del cliente (PDV)
    $pedidos = \App\Models\Pedido::with('puntoVenta')
        ->where('estado', 'pendiente')
        ->orderBy('created_at', 'asc')
        ->get();

    return Inertia::render('Pedidos/ListaChofer', [
        'pedidosPendientes' => $pedidos
    ]);
}
//VENTANILLA 
public function ventanilla()
{
    return Inertia::render('Ventanilla/Create', [
        'clientes' => \App\Models\PuntoVenta::all(),
        'productos' => \App\Models\Producto::all()
    ]);
}

}
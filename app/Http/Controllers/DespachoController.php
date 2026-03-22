<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Despacho; // <--- ESTA ES LA QUE TE FALTA
use App\Models\Pedido;   // <--- APROVECHA Y AGREGA ESTA TAMBIÉN
use App\Models\Chofer;   // <--- Y ESTA
use Illuminate\Support\Facades\DB;
class DespachoController extends Controller
{
   public function create()
{
    return Inertia::render('Despacho/PanelVentas', [
        // Solo traemos los que NO han sido asignados a un despacho aún
        'pedidosPendientes' => \App\Models\Pedido::where('estado', 'facturado')
            ->whereNull('despacho_id') // <--- Esto asegura que los ya despachados no salgan
            ->with('puntoVenta')
            ->get(),
        'choferes' => \App\Models\Chofer::with('user')->get(),
    ]);
}

public function store(Request $request)
{
    $request->validate([
        'chofer_id' => 'required|exists:choferes,id',
        'pedido_ids' => 'required|array|min:1',
    ]);

    // Declaramos la variable fuera para que esté disponible en el return
    $despacho = null;

    \DB::transaction(function () use ($request, &$despacho) {
        $chofer = \App\Models\Chofer::find($request->chofer_id);
        
        // 1. Crear el Despacho (con & para pasar la referencia al exterior)
        $despacho = \App\Models\Despacho::create([
            'chofer_id' => $request->chofer_id,
            'ruta_id'   => $chofer->ruta_id ?? 1,
            'estado'    => 'en_ruta',
            'placa_vehiculo' => $chofer->placa_vehiculo ?? 'S/P',
            'cantidad_botellones_salida' => count($request->pedido_ids),
        ]);

        // 2. Procesar cada pedido
        $pedidos = \App\Models\Pedido::whereIn('id', $request->pedido_ids)->with('productos')->get();

        foreach ($pedidos as $pedido) {
            $totalBonoPedido = 0;

            foreach ($pedido->productos as $producto) {
                $cantidadVenta = $producto->pivot->cantidad;
                $cantidadBono = floor($cantidadVenta / 10); // Lógica 10 + 1
                $totalSalida = $cantidadVenta + $cantidadBono;

                // Descontamos del inventario físico
                $producto->decrement('stock_actual', $totalSalida);
                
                // Acumulamos el bono para este pedido específico
                $totalBonoPedido += $cantidadBono;
            }

            // Actualizamos la cabecera del pedido una sola vez con el total de bonos
            $pedido->update([
                'despacho_id' => $despacho->id,
                'chofer_id'   => $request->chofer_id,
                'estado'      => 'en_camino',
                'descuento_bono' => $totalBonoPedido // Guarda la suma de todos los bonos
            ]);
        }
    });

    return redirect()->back()->with([
        'message' => 'Despacho Exitoso e Inventario Actualizado',
        'despachoId' => $despacho->id 
    ]);
}
//REPORTE DE CARGA
public function reporteCarga($id)
{
    $despacho = \App\Models\Despacho::with('chofer.user')->findOrFail($id);

    // 1. Resumen de carga para el camión (Igual que antes)
    $resumen = \Illuminate\Support\Facades\DB::table('pedido_producto')
        ->join('pedidos', 'pedido_producto.pedido_id', '=', 'pedidos.id')
        ->join('productos', 'pedido_producto.producto_id', '=', 'productos.id')
        ->where('pedidos.despacho_id', $id)
        ->select('productos.nombre', \Illuminate\Support\Facades\DB::raw('SUM(pedido_producto.cantidad) as total'))
        ->groupBy('productos.id', 'productos.nombre')
        ->get();

    // 2. FIX: Traemos los pedidos sumando sus cantidades desde la tabla intermedia
    $clientes = \App\Models\Pedido::where('despacho_id', $id)
        ->with('puntoVenta')
        ->withCount(['productos as cantidad' => function($query) {
            $query->select(\DB::raw('sum(cantidad)'));
        }])
        ->get();

    return \Inertia\Inertia::render('Despacho/ReporteCarga', [
        'despacho' => $despacho,
        'resumen'  => $resumen,
        'clientes' => $clientes
    ]);
}

//EDITAR DESPACHO
public function edit($id)
{
    return Inertia::render('Despacho/Edit', [
        'despacho' => Despacho::with(['chofer.user', 'pedidos.puntoVenta'])->findOrFail($id),
        'pedidosDisponibles' => Pedido::where('estado', 'pendiente')
            ->whereNull('despacho_id')
            ->with('puntoVenta')
            ->get(),
        'choferes' => Chofer::with('user')->get(),
    ]);
}

public function update(Request $request, $id)
{
    $despacho = Despacho::findOrFail($id);
    
    DB::transaction(function () use ($request, $despacho) {
        // 1. Identificar pedidos eliminados para devolver stock
        $pedidosActualesIds = $despacho->pedidos()->pluck('id')->toArray();
        $pedidosNuevosIds = $request->pedido_ids;
        
        $eliminados = array_diff($pedidosActualesIds, $pedidosNuevosIds);
        $agregados = array_diff($pedidosNuevosIds, $pedidosActualesIds);

        // 2. Procesar Eliminados: Quitar despacho_id y devolver stock
        foreach ($eliminados as $pId) {
            $pedido = Pedido::with('productos')->find($pId);
            foreach ($pedido->productos as $prod) {
                $cant = $prod->pivot->cantidad;
                $bono = floor($cant / 10);
                $prod->increment('stock_actual', ($cant + $bono));
            }
            $pedido->update(['despacho_id' => null, 'chofer_id' => null, 'estado' => 'pendiente']);
        }

        // 3. Procesar Agregados: Asignar despacho_id y restar stock
        foreach ($agregados as $pId) {
            $pedido = Pedido::with('productos')->find($pId);
            foreach ($pedido->productos as $prod) {
                $cant = $prod->pivot->cantidad;
                $bono = floor($cant / 10);
                $prod->decrement('stock_actual', ($cant + $bono));
            }
            $pedido->update(['despacho_id' => $despacho->id, 'chofer_id' => $despacho->chofer_id, 'estado' => 'en_camino']);
        }

        // 4. Actualizar datos generales del despacho
        $despacho->update([
            'chofer_id' => $request->chofer_id,
            'cantidad_botellones_salida' => count($pedidosNuevosIds)
        ]);
    });

    return redirect()->route('despachos.panel')->with('message', 'Despacho actualizado y stock sincronizado');
}
 public function panel() 
    {
         return Inertia::render('Despacho/PanelVentas', [
        'pedidosPendientes' => \App\Models\Pedido::where('estado', 'pendiente')
            ->whereNull('despacho_id')
            ->with('puntoVenta')
            ->get(),
        'choferes' => \App\Models\Chofer::with('user')->get(),
        
        // --- AÑADE ESTO ---
        'despachosRecientes' => \App\Models\Despacho::whereDate('created_at', today())
            ->with(['chofer.user'])
            ->withCount('pedidos')
            ->orderBy('id', 'desc')
            ->get(),
    ]);
    }
}

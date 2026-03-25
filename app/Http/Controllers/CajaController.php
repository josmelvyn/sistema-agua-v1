<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\Chofer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CajaController extends Controller
{
    public function index()
    {
        $hoy = now()->startOfDay();

        $choferesActivos = Chofer::with('user')
            ->whereHas('pedidos', function($query) use ($hoy) {
                $query->where('estado', 'entregado')
                      ->where('pagado', false) // Solo los que NO han entregado dinero
                      ->whereDate('updated_at', $hoy);
            })
            ->withCount(['pedidos' => function($query) use ($hoy) {
                $query->where('estado', 'entregado')
                      ->where('pagado', false)
                      ->whereDate('updated_at', $hoy);
            }])
            ->get();

        return Inertia::render('Caja/Index', ['choferes' => $choferesActivos]);
    }

    public function liquidarChofer($chofer_id)
    {
        $hoy = now()->startOfDay();
        
        // 1. Consulta de Totales (FILTRADA por pagado = false para evitar montos inflados)
        $totales = Pedido::where('chofer_id', $chofer_id)
            ->where('estado', 'entregado')
            ->where('pagado', false) // <--- ESTO EVITA LOS $57,000
            ->whereDate('updated_at', $hoy)
            ->selectRaw("
                COUNT(*) as total_pedidos,
                SUM(CASE WHEN metodo_pago = 'contado' THEN total ELSE 0 END) as efectivo_esperado,
                SUM(CASE WHEN metodo_pago = 'credito' THEN total ELSE 0 END) as ventas_credito,
                SUM(envases_recogidos) as total_envases_recogidos
            ")->first();

        // 2. Traemos la LISTA DETALLADA para que el cajero audite los 21 pedidos
        $detalles = Pedido::where('chofer_id', $chofer_id)
            ->where('estado', 'entregado')
            ->where('pagado', false)
            ->whereDate('updated_at', $hoy)
            ->with('puntoVenta')
            ->get();

        // Borra el dd() para que la página cargue
        return Inertia::render('Caja/Cuadre', [
            'totales' => $totales,
            'detalles' => $detalles, // Enviamos los 21 pedidos para verlos en una tabla
            'chofer' => Chofer::with('user')->findOrFail($chofer_id),
            'fecha' => $hoy->format('d-m-Y')
        ]);
    }

    public function finalizarCuadre(Request $request)
    {
        $request->validate([
            'chofer_id' => 'required|exists:choferes,id',
            'efectivo_entregado' => 'required|numeric|min:0',
            'efectivo_esperado' => 'required|numeric',
        ]);

        $diferencia = $request->efectivo_entregado - $request->efectivo_esperado;

        DB::transaction(function () use ($request, $diferencia) {
            $chofer = Chofer::findOrFail($request->chofer_id);

            if ($diferencia < 0) {
                $chofer->increment('deuda_pendiente', abs($diferencia));
            }

            // Marcamos como pagados los pedidos que acabamos de cobrar
            Pedido::where('chofer_id', $request->chofer_id)
    ->where('estado', 'entregado')
    ->where('pagado', false) // Buscamos los que falten por procesar
    ->whereDate('updated_at', now()->startOfDay())
    ->update(['pagado' => true]); // Marcamos TODOS como liquidados para que salgan del Index
        });

        $mensaje = $diferencia < 0 
            ? "⚠️ Faltante de $" . abs($diferencia) . " cargado a deuda."
            : "✅ Cuadre exitoso.";

        return redirect()->route('caja.index')->with('message', $mensaje);
    }

    public function reporteGeneral()
{
    $hoy = now()->startOfDay();

    // 1. Resumen de dinero por método de pago
    $resumenMetodos = Pedido::whereDate('updated_at', $hoy)
        ->where('estado', 'entregado')
        ->selectRaw("
            metodo_pago,
            SUM(total) as monto,
            COUNT(*) as cantidad
        ")
        ->groupBy('metodo_pago')
        ->get();

    // 2. Detalle de liquidaciones por chofer (incluyendo deudas generadas hoy)
    $liquidacionesChoferes = Chofer::with('user')
        ->withCount(['pedidos' => function($q) use ($hoy) {
            $q->where('estado', 'entregado')->whereDate('updated_at', $hoy);
        }])
        ->get()
        ->map(function($chofer) use ($hoy) {
            $stats = Pedido::where('chofer_id', $chofer->id)
                ->whereDate('updated_at', $hoy)
                ->where('estado', 'entregado')
                ->selectRaw("SUM(CASE WHEN metodo_pago = 'contado' THEN total ELSE 0 END) as efectivo")
                ->first();
            
            $chofer->efectivo_ruta = $stats->efectivo ?? 0;
            return $chofer;
        });

    return Inertia::render('Caja/ReporteGeneral', [
        'resumen' => $resumenMetodos,
        'choferes' => $liquidacionesChoferes,
        'fecha' => now()->format('d/m/Y')
    ]);
}

}
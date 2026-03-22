<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductoController extends Controller
{
    // Ver todos los productos (Inventario)
    public function index()
    {
        return Inertia::render('Productos/Index', [
            'productos' => Producto::all()
        ]);
    }

    // Sumar stock (Ajuste)
    public function ajustarStock(Request $request, $id)
    {
        $request->validate([
            'cantidad_entrada' => 'required|integer|min:1'
        ]);

        $producto = Producto::findOrFail($id);
        
        // Sumamos al stock actual
        $producto->increment('stock_actual', $request->cantidad_entrada);

        return redirect()->back()->with('message', 'Stock actualizado con éxito');
    }
    public function actualizarPrecio(Request $request, $id)
{
    $request->validate([
        'nuevo_precio' => 'required|numeric|min:0'
    ]);

    $producto = \App\Models\Producto::findOrFail($id);
    $producto->update(['precio_regular' => $request->nuevo_precio]);

    return redirect()->back()->with('message', 'Precio actualizado');
}
public function store(Request $request)
{
    $validated = $request->validate([
        'nombre' => 'required|string|max:255',
        'precio_regular' => 'required|numeric|min:0',
        'stock_initial' => 'required|integer|min:0',
        'cantidad_minima_bono' => 'nullable|integer|min:0',
        'cantidad_regalo' => 'nullable|integer|min:0',
    ]);

    \App\Models\Producto::create([
        'nombre' => $validated['nombre'],
        'precio_regular' => $validated['precio_regular'],
        'stock_actual' => $validated['stock_initial'],
        'cantidad_minima_bono' => $validated['cantidad_minima_bono'] ?? 0,
        'cantidad_regalo' => $validated['cantidad_regalo'] ?? 0,
    ]);

    return redirect()->route('productos.index')->with('message', 'Producto creado con éxito');
}
public function create()
{
     return Inertia::render('Productos/Create');
    return Inertia::render('PuntosVenta/Create', [
        'rutas' => \App\Models\Ruta::all(),
        // Importante: Breeze espera que el usuario esté en 'auth'
        'auth' => [
            'user' => auth()->user(),
            'rol' => auth()->user()->rol,
        ],
    ]);
}
}

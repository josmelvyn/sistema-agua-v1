<?php

namespace App\Http\Controllers;

use App\Models\PuntoVenta;
use App\Models\Ruta;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PuntoVentaController extends Controller
{
    public function create()
    {
        // Esto envía las rutas a React para el selector
        return Inertia::render('PuntosVenta/Create', [
          'rutas' => \App\Models\Ruta::all() // Verifica que esto no devuelva error
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
        'nombre_negocio' => 'required|string|max:255',
        'dueño' => 'required|string',
        'cedula_rnc' => 'nullable|unique:punto_ventas',
        'telefono' => 'required',
        'direccion' => 'required',
        'ruta_id' => 'required|exists:rutas,id',
        'latitud' => 'nullable|numeric',
        'longitud' => 'nullable|numeric',
        'limite_credito' => 'numeric|min:0',
        'capacidad_anaquel' => 'nullable|integer',
        ]);

       \App\Models\PuntoVenta::create($validated);

    return redirect()->route('dashboard')->with('message', 'Cliente registrado correctamente');
    }
}
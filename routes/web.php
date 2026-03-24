<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PuntoVentaController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProductoController;
use App\Models\PuntoVenta;
use App\Models\Pedido;
use App\Models\Producto;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserController; 
use App\Http\Controllers\DespachoController;
use App\Http\Controllers\FacturacionController;
use App\Http\Controllers\CajaController;

// RUTA PÚBLICA (WELCOME)
Route::get('/', function () {
    return redirect()->route('login');
});

// RUTAS PROTEGIDAS (DEBES ESTAR LOGUEADO)
Route::middleware(['auth', 'verified'])->group(function () {
    
    // DASHBOARD
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'stats' => [
                'total_clientes' => PuntoVenta::count(),
                'ventas_hoy' => Pedido::whereDate('created_at', today())->sum('total'),
                'pedidos_pendientes' => Pedido::where('estado', 'pendiente')->count(),
                'creditos_fuera' => PuntoVenta::sum('saldo_actual'),
                'stock_bajo' => Producto::where('stock_actual', '<=', 50)->get(),
            ]
        ]);
    })->name('dashboard');

    //Crear usuario
    Route::get('/usuarios/nuevo', function() {
    return Inertia::render('Admin/Users/Create');
    })->name('usuarios.create');

    //Usuario
    Route::post('/usuarios/guardar', [UserController::class, 'store'])->name('usuarios.store');

    // PRODUCTOS / INVENTARIO
    Route::get('/inventario', [ProductoController::class, 'index'])->name('productos.index');
    Route::get('/productos/crear', [ProductoController::class, 'create'])->name('productos.create');
    Route::post('/productos', [ProductoController::class, 'store'])->name('productos.store');
    Route::patch('/productos/{id}/precio', [ProductoController::class, 'actualizarPrecio'])->name('productos.precio');
    Route::patch('/productos/{id}/ajustar', [ProductoController::class, 'ajustarStock'])->name('productos.ajustar');

    // CLIENTES
    Route::get('/clientes/nuevo', [PuntoVentaController::class, 'create'])->name('clientes.create');
    Route::post('/clientes', [PuntoVentaController::class, 'store'])->name('clientes.store');

    // PREVENTA Y PEDIDOS
    Route::get('/preventa/nueva', [PedidoController::class, 'create'])->name('pedidos.create');
    Route::post('/preventa/guardar', [PedidoController::class, 'store'])->name('pedidos.store'); // <-- IMPORTANTE
    Route::patch('/pedidos/{id}/entregar', [PedidoController::class, 'entregar'])->name('pedidos.entregar');
    Route::get('/reporte/liquidacion/{chofer_id}', [PedidoController::class, 'liquidacion'])->name('reporte.liquidacion');
    Route::get('/mis-entregas', [PedidoController::class, 'indexChofer'])->name('pedidos.chofer');
    // PERFIL
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
   Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');
    // DESPACHO
    Route::get('/despacho/panel', [DespachoController::class, 'panel'])->name('despacho.panel');
    Route::get('/despacho/mapa', [DespachoController::class, 'mapaDespacho'])->name('despacho.mapa');
    Route::get('/despachos/{id}/reporte', [DespachoController::class, 'reporteCarga'])->name('despachos.reporte');
    Route::post('/despachos/guardar', [DespachoController::class, 'store'])->name('despacho.store');
    Route::get('/despachos/{id}/editar', [DespachoController::class, 'edit'])->name('despachos.edit');
    Route::get('/despacho/panel', [DespachoController::class, 'panel'])->name('despachos.panel');
    Route::get('/despacho/panel', [DespachoController::class, 'panel'])->name('despachos.panel');
    Route::post('/despachos/{id}/actualizar', [DespachoController::class, 'update'])->name('despachos.update');
   //PEDIDOS
   Route::post('/pedidos', [PedidoController::class, 'store'])->name('pedidos.store');
   //FACTURACION
   Route::post('/facturacion/aprobar/{id}', [App\Http\Controllers\FacturacionController::class, 'aprobarYFacturar'])
    ->name('pedidos.aprobar'); 
   Route::get('/facturacion', [FacturacionController::class, 'index'])->name('facturacion.index');
   //VENTANILLA
   Route::get('/ventanilla', [PedidoController::class, 'ventanilla'])->name('ventanilla.create');
    //ENTREGA CHOFER
    Route::post('/pedidos/{id}/entregar', [App\Http\Controllers\PedidoController::class, 'entregar'])->name('pedidos.entregar');
    Route::get('/mi-ruta', [DespachoController::class, 'mapaChofer'])->name('despacho.mapa');
Route::get('/mi-ruta', [DespachoController::class, 'mapaDespacho'])->name('despacho.chofer');
    Route::post('/pedidos/{id}/entregar-chofer', [App\Http\Controllers\PedidoController::class, 'marcarEntregado'])->name('pedidos.entregar_chofer');
   //CAJA
    Route::get('/caja/cuadre/{chofer_id}', [CajaController::class, 'liquidarChofer'])->name('caja.cuadre');
    Route::get('/caja', [CajaController::class, 'index'])->name('caja.index');
    Route::post('/caja/finalizar', [CajaController::class, 'finalizarCuadre'])->name('caja.finalizar');
    Route::get('/caja', [CajaController::class, 'index'])->name('caja.index');
    });


require __DIR__.'/auth.php';
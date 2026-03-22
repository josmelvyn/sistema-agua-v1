<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia; // <--- ERROR 1: Faltaba importar Inertia
use Illuminate\Support\Facades\Hash; // <--- ERROR 2: Faltaba importar Hash
use App\Models\User; // Recomendado: Importar para limpiar el código
use Illuminate\Support\Facades\Log; // Para ver errores si persisten
use App\Models\Chofer;

class UserController extends Controller
{
    public function create()
    {
        // Asegúrate de que el archivo exista en resources/js/Pages/Admin/Users/Create.vue (o .jsx)
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|min:8|confirmed',
            'rol'      => 'required|in:admin,chofer,vendedor',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            // ERROR 3: Sin Hash::make() daría el error de "Bcrypt" que vimos antes
            'password' => Hash::make($validated['password']), 
            'rol'      => $validated['rol'],
        ]);

        if ($validated['rol'] === 'chofer') {
            \App\Models\Chofer::create(['user_id' => $user->id]);
        }

        return redirect()->route('dashboard')->with('message', 'Usuario creado con éxito');
    }
}
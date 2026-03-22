<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    public function entregar(Request $request, $id)
{
    $pedido = \App\Models\Pedido::findOrFail($id);
    
    $pedido->update([
        'estado' => 'entregado',
        'pagado' => $request->metodo_pago === 'efectivo',
        'envases_entregados' => $request->envases_entregados,
        'envases_recogidos' => $request->envases_recogidos,
    ]);

    // Lógica de envases prestados: Si entregó más de los que recogió, 
    // se le cargan al inventario del cliente (Punto de Venta)
    if ($request->envases_entregados > $request->envases_recogidos) {
        $diferencia = $request->envases_entregados - $request->envases_recogidos;
        $pedido->puntoVenta->increment('envases_prestados', $diferencia);
    }

    return redirect()->back();
}

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}

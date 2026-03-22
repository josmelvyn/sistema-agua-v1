import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

export default function Index({ auth, productos }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Inventario de Almacén</h2>}>
            <Head title="Inventario" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-100 italic text-gray-500">
                                    <th className="p-3">Producto</th>
                                    <th className="p-3">Stock Actual</th>
                                    <th className="p-3">Precio</th>
                                    <th className="p-3">Oferta 10+1</th>
                                    <th className="p-3">Entrada de Almacén</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((producto) => (
                                    <tr key={producto.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-bold">{producto.nombre}</td>
                                        <td className={`p-3 font-bold ${producto.stock_actual < 50 ? 'text-red-500' : 'text-green-600'}`}>
                                            {producto.stock_actual} und.
                                        </td>
                                        <td className="p-3">
                                            <FormPrecio id={producto.id} precioActual={producto.precio_regular} />
                                        </td>
                                        <td className="p-3 text-sm text-blue-600 italic">
                                            {producto.cantidad_minima_bono > 0 ? `Aplica desde ${producto.cantidad_minima_bono}` : 'Sin oferta'}
                                        </td>
                                        <td className="p-3">
                                            <FormAjustar id={producto.id} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// CADA FUNCIÓN DEBE ESTAR SEPARADA E INDEPENDIENTE
function FormAjustar({ id }) {
    const { data, setData, patch, processing, reset } = useForm({ cantidad_entrada: '' });

    const submit = (e) => {
        e.preventDefault();
        patch(route('productos.ajustar', id), { onSuccess: () => reset() });
    };

    return (
        <form onSubmit={submit} className="flex gap-2">
            <input type="number" placeholder="Cant." className="w-20 border rounded p-1 text-sm"
                value={data.cantidad_entrada} onChange={e => setData('cantidad_entrada', e.target.value)} required />
            <button disabled={processing} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                + Cargar
            </button>
        </form>
    );
}

function FormPrecio({ id, precioActual }) {
    const { data, setData, patch, processing } = useForm({ nuevo_precio: precioActual });

    const submit = (e) => {
        e.preventDefault();
        patch(route('productos.precio', id));
    };

    return (
        <form onSubmit={submit} className="flex gap-2">
            <span className="text-gray-500 mt-1">$</span>
            <input type="number" step="0.01" className="w-24 border rounded p-1 text-sm"
                value={data.nuevo_precio} onChange={e => setData('nuevo_precio', e.target.value)} />
            <button disabled={processing} className="text-blue-600 hover:underline text-xs font-bold">
                Actualizar
            </button>
        </form>
    );
}
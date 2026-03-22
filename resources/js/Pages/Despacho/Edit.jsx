import React from 'react';
import { useForm, Head, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function EditDespacho({ despacho, pedidosDisponibles, choferes, auth }) {
    const { data, setData, post, processing } = useForm({
        chofer_id: despacho.chofer_id,
        // Cargamos los IDs de los pedidos que ya están en este despacho
        pedido_ids: despacho.pedidos.map(p => p.id)
    });

    const togglePedido = (id) => {
        const ids = data.pedido_ids.includes(id) 
            ? data.pedido_ids.filter(i => i !== id) 
            : [...data.pedido_ids, id];
        setData('pedido_ids', ids);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="p-6 grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white p-6 shadow rounded-lg">
                    <h2 className="font-bold text-xl mb-4">Editar Pedidos del Despacho #{despacho.id}</h2>
                    
                    <h3 className="text-blue-600 font-bold mb-2 uppercase text-xs">Pedidos en este viaje:</h3>
                    {despacho.pedidos.map(p => (
                        <label key={p.id} className="flex items-center gap-3 p-3 border-b bg-blue-50">
                            <input type="checkbox" checked={data.pedido_ids.includes(p.id)} onChange={() => togglePedido(p.id)} />
                            <span className="font-bold">{p.punto_venta.nombre_negocio}</span>
                        </label>
                    ))}

                    <h3 className="text-gray-400 font-bold mt-6 mb-2 uppercase text-xs">Agregar otros pendientes:</h3>
                    {pedidosDisponibles.map(p => (
                        <label key={p.id} className="flex items-center gap-3 p-3 border-b hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked={data.pedido_ids.includes(p.id)} onChange={() => togglePedido(p.id)} />
                            <span>{p.punto_venta.nombre_negocio}</span>
                        </label>
                    ))}
                </div>

                <div className="bg-white p-6 shadow rounded-lg h-fit">
                    <label className="font-bold block mb-2">Cambiar Chofer</label>
                    <select className="w-full border p-2 mb-4" value={data.chofer_id} onChange={e => setData('chofer_id', e.target.value)}>
                        {choferes.map(c => <option key={c.id} value={c.id}>{c.user.name}</option>)}
                    </select>

                    <button 
                        onClick={() => post(route('despachos.update', despacho.id))}
                        disabled={processing}
                        className="w-full bg-blue-600 text-white p-3 rounded font-black"
                    >
                        {processing ? 'GUARDANDO...' : 'ACTUALIZAR DESPACHO'}
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
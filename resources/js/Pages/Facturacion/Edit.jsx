import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, pedido, productos }) {
    const { data, setData, post, processing } = useForm({
        items: pedido.productos.map(p => ({
            id: p.id,
            nombre: p.nombre,
            cantidad: p.pivot.cantidad || 0,
            bono: p.pivot.bono || 0,
            precio: Number(p.pivot.precio_unitario) || 0,
        }))
    });

    const actualizarItem = (index, campo, valor) => {
        const nuevosItems = [...data.items];
        // Convertimos a número para evitar que se guarden como texto
        nuevosItems[index][campo] = valor === '' ? 0 : Number(valor);
        setData('items', nuevosItems);
    };

    const eliminarItem = (index) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    // Calculamos el total en tiempo real para que la oficina vea el cambio
    const totalActual = data.items.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-black text-xl text-gray-800 uppercase">✏️ Editar Pedido #{pedido.id}</h2>}>
            <Head title="Editar Pedido" />
            <div className="p-6 max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-gray-100">
                <div className="mb-6 p-4 bg-blue-50 rounded-2xl flex justify-between items-center">
                    <span className="text-blue-800 font-black uppercase text-xs tracking-widest">Cliente: {pedido.punto_venta?.nombre_negocio}</span>
                    <span className="text-blue-800 font-black text-xl">Total: ${totalActual.toLocaleString()}</span>
                </div>

                <table className="w-full mb-8">
                    <thead className="bg-slate-900 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                        <tr>
                            <th className="p-4 text-left rounded-tl-2xl">Producto</th>
                            <th className="p-4 text-center">Cant. Venta</th>
                            <th className="p-4 text-center text-blue-400">Bono (Regalo)</th>
                            <th className="p-4 text-right">Precio</th>
                            <th className="p-4 text-center rounded-tr-2xl"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.items.map((item, i) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-bold text-gray-700 uppercase text-xs">{item.nombre}</td>
                                <td className="p-4 text-center">
                                    <input 
                                        type="number" 
                                        className="w-24 p-2 border-2 border-gray-100 rounded-xl text-center font-black focus:border-blue-500 outline-none" 
                                        value={item.cantidad} 
                                        onChange={e => actualizarItem(i, 'cantidad', e.target.value)} 
                                    />
                                </td>
                                <td className="p-4 text-center">
                                    <input 
                                        type="number" 
                                        className="w-24 p-2 border-2 border-blue-100 rounded-xl text-center bg-blue-50 font-black text-blue-700 focus:border-blue-500 outline-none" 
                                        value={item.bono} 
                                        onChange={e => actualizarItem(i, 'bono', e.target.value)} 
                                    />
                                </td>
                                <td className="p-4 text-right font-black text-gray-600">${item.precio.toLocaleString()}</td>
                                <td className="p-4 text-center">
                                    <button 
                                        type="button"
                                        onClick={() => eliminarItem(i)} 
                                        className="text-red-300 hover:text-red-600 transition-colors font-black text-xl"
                                    >✕</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end items-center gap-6 p-4 border-t">
                    <button 
                        onClick={() => post(route('facturacion.update', pedido.id))} 
                        disabled={processing || data.items.length === 0}
                        className={`px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                            processing || data.items.length === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                    >
                        {processing ? 'Guardando...' : '💾 Guardar Cambios'}
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CreatePedido({ auth, clientes, productos }) {
    const [itemSeleccionado, setItemSeleccionado] = useState({ producto_id: '', cantidad: 1 });
    
    const { data, setData, post, processing, reset } = useForm({
        punto_venta_id: '',
        metodo_pago: 'contado', 
        items: [], 
        entrega_inmediata: false, // FIJO: Siempre preventa para oficina
        total: 0
    });

    const agregarItem = () => {
        if (!itemSeleccionado.producto_id) return;
        const producto = productos.find(p => p.id == itemSeleccionado.producto_id);
        const cant = Number(itemSeleccionado.cantidad);
        const nuevoItem = {
            id: producto.id,
            nombre: producto.nombre,
            cantidad: cant,
            bono: Math.floor(cant / 10),
            precio: Number(producto.precio_regular),
            subtotal: cant * Number(producto.precio_regular)
        };
        const nuevaLista = [...data.items, nuevoItem];
        const suma = nuevaLista.reduce((acc, item) => acc + item.subtotal, 0);
        setData(prev => ({ ...prev, items: nuevaLista, total: suma }));
        setItemSeleccionado({ producto_id: '', cantidad: 1 });
    };

    const enviarPreventa = (e) => {
        e.preventDefault();
        post(route('pedidos.store'), { onSuccess: () => reset() });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-black text-xl text-gray-800">📝 Nueva Preventa</h2>}>
            <Head title="Crear Preventa" />
            <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* CONFIGURACIÓN */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 shadow-xl rounded-[2rem] border">
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">1. Cliente</label>
                        <select className="w-full p-3 border-gray-200 rounded-xl bg-gray-50 font-bold mb-6"
                            value={data.punto_venta_id} onChange={e => setData('punto_venta_id', e.target.value)}>
                            <option value="">-- Seleccionar --</option>
                            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre_negocio}</option>)}
                        </select>

                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">2. Pago</label>
                        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                            <button type="button" onClick={() => setData('metodo_pago', 'contado')}
                                className={`flex-1 py-3 rounded-xl font-black text-xs transition ${data.metodo_pago === 'contado' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>💵 CONTADO</button>
                            <button type="button" onClick={() => setData('metodo_pago', 'credito')}
                                className={`flex-1 py-3 rounded-xl font-black text-xs transition ${data.metodo_pago === 'credito' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}>💳 CRÉDITO</button>
                        </div>
                    </div>

                    <div className="bg-blue-600 p-6 shadow-xl rounded-[2rem] text-white">
                        <label className="block text-[10px] font-black uppercase opacity-50 mb-4">3. Productos</label>
                        <select className="w-full p-3 rounded-xl text-gray-900 font-bold mb-4"
                            value={itemSeleccionado.producto_id} onChange={e => setItemSeleccionado({...itemSeleccionado, producto_id: e.target.value})}>
                            <option value="">Elegir...</option>
                            {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                        </select>
                        <div className="flex gap-2">
                            <input type="number" className="w-20 p-3 rounded-xl text-gray-900 font-bold" value={itemSeleccionado.cantidad} onChange={e => setItemSeleccionado({...itemSeleccionado, cantidad: e.target.value})} />
                            <button type="button" onClick={agregarItem} className="flex-1 bg-white text-blue-600 font-black rounded-xl hover:bg-blue-50">+ AÑADIR</button>
                        </div>
                    </div>
                </div>

                {/* RESUMEN */}
                <div className="lg:col-span-2 bg-white shadow-xl rounded-[2.5rem] overflow-hidden border flex flex-col min-h-[500px]">
                    <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
                        <h3 className="font-black text-gray-800 uppercase">Detalle de Preventa</h3>
                        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-[10px] font-black">{data.items.length} Items</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[9px] font-black uppercase text-gray-400 border-b">
                                <tr><th className="p-4">Item</th><th className="p-4 text-center">Cant.</th><th className="p-4 text-center text-blue-500">Bono</th><th className="p-4 text-right">Subtotal</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.items.map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50 font-bold text-sm">
                                        <td className="p-4 uppercase">{item.nombre}</td>
                                        <td className="p-4 text-center">{item.cantidad}</td>
                                        <td className="p-4 text-center text-blue-600">+{item.bono}</td>
                                        <td className="p-4 text-right">${item.subtotal.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-8 bg-blue-900 text-white flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-black opacity-50 uppercase">Total Estimado</p>
                            <p className="text-4xl font-black">${data.total.toLocaleString()}</p>
                        </div>
                        <button onClick={enviarPreventa} disabled={processing || data.items.length === 0 || !data.punto_venta_id}
                            className="bg-green-500 hover:bg-green-600 px-10 py-4 rounded-2xl font-black text-xl uppercase shadow-xl disabled:bg-gray-700">
                            {processing ? '...' : '✅ Confirmar Preventa'}
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
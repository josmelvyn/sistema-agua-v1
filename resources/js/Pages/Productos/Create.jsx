import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CreatePedido({ auth, clientes, productos }) {
    const [itemSeleccionado, setItemSeleccionado] = useState({ producto_id: '', cantidad: 1 });
    
    const { data, setData, post, processing, errors, reset } = useForm({
        punto_venta_id: '',
        metodo_pago: 'contado', // 'contado' o 'credito'
        items: [], // Array de productos (Carrito)
        subtotal: 0,
        total: 0
    });

    // Función para añadir productos a la lista temporal
    const agregarItem = () => {
        if (!itemSeleccionado.producto_id) return;

        const producto = productos.find(p => p.id == itemSeleccionado.producto_id);
        const cant = Number(itemSeleccionado.cantidad);
        const precio = Number(producto.precio_regular);
        const bono = Math.floor(cant / 10); // Lógica 10 + 1

        const nuevoItem = {
            id: producto.id,
            nombre: producto.nombre,
            cantidad: cant,
            bono: bono,
            precio: precio,
            subtotal: cant * precio
        };

        const nuevaLista = [...data.items, nuevoItem];
        actualizarTotales(nuevaLista);
        setItemSeleccionado({ producto_id: '', cantidad: 1 }); // Reset selector
    };

    const quitarItem = (index) => {
        const nuevaLista = data.items.filter((_, i) => i !== index);
        actualizarTotales(nuevaLista);
    };

    const actualizarTotales = (lista) => {
        const suma = lista.reduce((acc, item) => acc + item.subtotal, 0);
        setData(prev => ({
            ...prev,
            items: lista,
            subtotal: suma,
            total: suma
        }));
    };

    const enviarPreventa = (e) => {
        e.preventDefault();
        post(route('pedidos.store'), {
            onSuccess: () => reset()
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-black text-xl text-gray-800">📝 Nueva Preventa</h2>}>
            <Head title="Crear Preventa" />

            <div className="p-6 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* COLUMNA IZQUIERDA: CONFIGURACIÓN Y SELECCIÓN */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 shadow-xl rounded-[2rem] border border-gray-100">
                            <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-widest mb-4">1. Datos del Cliente</h3>
                            
                            <select 
                                className="w-full p-3 border-gray-200 rounded-xl bg-gray-50 font-bold mb-6"
                                value={data.punto_venta_id}
                                onChange={e => setData('punto_venta_id', e.target.value)}
                            >
                                <option value="">-- Seleccionar Cliente --</option>
                                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre_negocio}</option>)}
                            </select>

                            <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-widest mb-4">2. Condición de Pago</h3>
                            <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                                <button 
                                    type="button"
                                    onClick={() => setData('metodo_pago', 'contado')}
                                    className={`flex-1 py-3 rounded-xl font-black text-xs transition ${data.metodo_pago === 'contado' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                                >💵 CONTADO</button>
                                <button 
                                    type="button"
                                    onClick={() => setData('metodo_pago', 'credito')}
                                    className={`flex-1 py-3 rounded-xl font-black text-xs transition ${data.metodo_pago === 'credito' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}
                                >💳 CRÉDITO</button>
                            </div>
                        </div>

                        <div className="bg-blue-600 p-6 shadow-xl rounded-[2rem] text-white">
                            <h3 className="font-black uppercase text-[10px] opacity-70 mb-4">3. Añadir Productos</h3>
                            <div className="space-y-4">
                                <select 
                                    className="w-full p-3 rounded-xl text-gray-900 font-bold outline-none"
                                    value={itemSeleccionado.producto_id}
                                    onChange={e => setItemSeleccionado({...itemSeleccionado, producto_id: e.target.value})}
                                >
                                    <option value="">Elegir Producto...</option>
                                    {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} (${p.precio_regular})</option>)}
                                </select>
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        className="w-20 p-3 rounded-xl text-gray-900 font-bold" 
                                        value={itemSeleccionado.cantidad}
                                        onChange={e => setItemSeleccionado({...itemSeleccionado, cantidad: e.target.value})}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={agregarItem}
                                        className="flex-1 bg-white text-blue-600 font-black rounded-xl hover:bg-blue-50 active:scale-95 transition"
                                    >+ AGREGAR</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: RESUMEN DEL PEDIDO */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white shadow-xl rounded-[2.5rem] overflow-hidden border border-gray-100 min-h-[400px] flex flex-col">
                            <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                                <h3 className="font-black text-gray-800 uppercase tracking-tighter">Resumen de Preventa</h3>
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black">{data.items.length} ARTÍCULOS</span>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {data.items.length === 0 ? (
                                    <div className="text-center py-20 text-gray-300 italic">No hay productos añadidos aún.</div>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-[9px] font-black uppercase text-gray-400">
                                            <tr>
                                                <th className="p-4">Producto</th>
                                                <th className="p-4 text-center">Cant.</th>
                                                <th className="p-4 text-center text-blue-500">Bono</th>
                                                <th className="p-4 text-right">Subtotal</th>
                                                <th className="p-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {data.items.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50 group">
                                                    <td className="p-4 font-bold text-gray-700 uppercase text-sm">{item.nombre}</td>
                                                    <td className="p-4 text-center font-black">{item.cantidad}</td>
                                                    <td className="p-4 text-center">
                                                        {item.bono > 0 ? <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-[10px] font-black">+{item.bono}</span> : '-'}
                                                    </td>
                                                    <td className="p-4 text-right font-black">${item.subtotal.toLocaleString()}</td>
                                                    <td className="p-4 text-right">
                                                        <button onClick={() => quitarItem(index)} className="text-red-300 hover:text-red-600 font-bold transition">✕</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Estimado</p>
                                    <p className="text-4xl font-black">${data.total.toLocaleString()}</p>
                                </div>
                                <button 
                                    onClick={enviarPreventa}
                                    disabled={processing || data.items.length === 0 || !data.punto_venta_id}
                                    className={`px-10 py-4 rounded-2xl font-black text-lg transition shadow-xl active:scale-95 ${
                                        processing || data.items.length === 0 || !data.punto_venta_id
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                                >
                                    {processing ? 'GUARDANDO...' : '✅ ENVIAR PEDIDO'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
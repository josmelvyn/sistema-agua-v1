import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CreatePedido({ auth, clientes, productos }) {
    const [itemSeleccionado, setItemSeleccionado] = useState({ producto_id: '', cantidad: 1 });
    
    const { data, setData, post, processing, errors, reset } = useForm({
         punto_venta_id: '',
         metodo_pago: 'contado', 
         items: [],
        entrega_inmediata: false, // Siempre false para el preventista
        total: 0
    });

    const agregarItem = () => {
        if (!itemSeleccionado.producto_id) return;

        const producto = productos.find(p => p.id == itemSeleccionado.producto_id);
        const cant = Number(itemSeleccionado.cantidad);
        const precio = Number(producto.precio_regular);
        const bono = Math.floor(cant / 10); 

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
        setItemSeleccionado({ producto_id: '', cantidad: 1 });
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

    const enviarPedido = (e) => {
        e.preventDefault();
        post(route('pedidos.store'), {
            onSuccess: () => {
                reset();
                alert("Operación realizada con éxito");
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-black text-xl text-gray-800">📦 Nueva Venta Por Ventanilla</h2>}>
            <Head title="Crear Pedido" />

            <div className="p-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* COLUMNA IZQUIERDA: CONFIGURACIÓN */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 shadow-xl rounded-[2rem] border border-gray-100">
                            <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-widest mb-4">1. Cliente</h3>
                            <select 
                                className="w-full p-3 border-gray-200 rounded-xl bg-gray-50 font-bold mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={data.punto_venta_id}
                                onChange={e => setData('punto_venta_id', e.target.value)}
                            >
                                <option value="">-- Seleccionar --</option>
                                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre_negocio}</option>)}
                            </select>

                            <h3 className="font-black text-gray-400 uppercase text-[10px] mb-4">Condición de Pago</h3>
                            <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                                <button type="button" onClick={() => setData('metodo_pago', 'contado')}
                                    className={`flex-1 py-3 rounded-xl font-black text-xs transition ${data.metodo_pago === 'contado' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>💵 CONTADO</button>
                                <button type="button" onClick={() => setData('metodo_pago', 'credito')}
                                    className={`flex-1 py-3 rounded-xl font-black text-xs transition ${data.metodo_pago === 'credito' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}>💳 CRÉDITO</button>
                            </div>

                            <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-widest mb-4">3. Logística</h3>
                            <div className="space-y-2">
                                <button type="button" onClick={() => setData('entrega_inmediata', false)}
                                    className={`w-full p-3 rounded-xl font-bold text-xs border transition ${!data.entrega_inmediata ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-100'}`}>
                                    🚚 ENVIAR CON CHOFER
                                </button>
                                <button type="button" onClick={() => setData('entrega_inmediata', true)}
                                    className={`w-full p-3 rounded-xl font-bold text-xs border transition ${data.entrega_inmediata ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-600 border-green-100'}`}>
                                    🏃 CLIENTE SE LO LLEVA
                                </button>
                            </div>
                        </div>

                        {/* AGREGAR PRODUCTOS */}
                        <div className="bg-gray-900 p-6 shadow-xl rounded-[2rem] text-white">
                            <h3 className="font-black uppercase text-[10px] opacity-50 mb-4 tracking-widest">4. Productos</h3>
                            <div className="space-y-4">
                                <select className="w-full p-3 rounded-xl text-gray-900 font-bold outline-none"
                                    value={itemSeleccionado.producto_id}
                                    onChange={e => setItemSeleccionado({...itemSeleccionado, producto_id: e.target.value})}>
                                    <option value="">Elegir...</option>
                                    {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                </select>
                                <div className="flex gap-2">
                                    <input type="number" className="w-20 p-3 rounded-xl text-gray-900 font-bold" 
                                        value={itemSeleccionado.cantidad} min="1"
                                        onChange={e => setItemSeleccionado({...itemSeleccionado, cantidad: e.target.value})} />
                                    <button type="button" onClick={agregarItem}
                                        className="flex-1 bg-blue-500 text-white font-black rounded-xl hover:bg-blue-400 transition">+ AÑADIR</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: CARRITO */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white shadow-xl rounded-[2.5rem] overflow-hidden border border-gray-100 flex flex-col min-h-[500px]">
                            <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
                                <h3 className="font-black text-gray-800 uppercase tracking-tighter">Detalle de Venta</h3>
                                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {data.items.length} Productos
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {data.items.length === 0 ? (
                                    <div className="text-center py-32 text-gray-300 italic font-medium">El carrito está vacío.</div>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-[9px] font-black uppercase text-gray-400 border-b">
                                            <tr>
                                                <th className="p-4">Item</th>
                                                <th className="p-4 text-center">Cant.</th>
                                                <th className="p-4 text-center text-blue-500">Bono</th>
                                                <th className="p-4 text-right">Subtotal</th>
                                                <th className="p-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {data.items.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50 group transition-colors">
                                                    <td className="p-4 font-bold text-gray-700 uppercase text-sm">{item.nombre}</td>
                                                    <td className="p-4 text-center font-black">{item.cantidad}</td>
                                                    <td className="p-4 text-center">
                                                        {item.bono > 0 ? <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-[10px] font-black">+{item.bono}</span> : '-'}
                                                    </td>
                                                    <td className="p-4 text-right font-black text-gray-900">${item.subtotal.toLocaleString()}</td>
                                                    <td className="p-4 text-right">
                                                        <button onClick={() => quitarItem(index)} className="text-red-300 hover:text-red-600 font-bold text-lg">✕</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* TOTALES Y CONFIRMACIÓN */}
                            <div className={`p-8 transition-colors duration-500 flex justify-between items-center ${data.entrega_inmediata ? 'bg-green-600' : 'bg-blue-900'} text-white`}>
                                <div>
                                    <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">Total a Pagar</p>
                                    <p className="text-5xl font-black">${data.total.toLocaleString()}</p>
                                </div>
                                <button 
                                    onClick={enviarPedido}
                                    disabled={processing || data.items.length === 0 || !data.punto_venta_id}
                                    className={`px-12 py-5 rounded-2xl font-black text-xl uppercase transition shadow-2xl active:scale-95 ${
                                        processing || data.items.length === 0 || !data.punto_venta_id
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                        : 'bg-white text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    {processing ? '...' : (data.entrega_inmediata ? '✅ Venta Directa' : '📦 Crear Preventa')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
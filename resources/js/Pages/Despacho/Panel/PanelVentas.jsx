import React from 'react';
import { useForm, Head, usePage } from '@inertiajs/react'; // 1. Añadimos usePage
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PanelVentas({ auth, pedidosPendientes, choferes }) {
    // 2. Extraemos las props globales (donde Laravel envía el 'flash')
    const { props } = usePage(); 
    
    const { data, setData, post, processing, errors } = useForm({
        chofer_id: '',
        pedido_ids: []
    });

    const togglePedido = (id) => {
        const ids = data.pedido_ids.includes(id) 
            ? data.pedido_ids.filter(i => i !== id) 
            : [...data.pedido_ids, id];
        setData('pedido_ids', ids);
    };

    const submit = (e) => {
        e.preventDefault();
        // Usamos preserveScroll para que la página no salte al recargar
        post('/despachos/guardar', { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-bold text-xl text-gray-800">Mesa de Despacho (Ventas)</h2>}
        >
            <Head title="Mesa de Despacho" />

            <div className="p-6 max-w-7xl mx-auto">
                
                {/* 🖨️ BLOQUE DE ÉXITO E IMPRESIÓN (NUEVO) */}
                {props.flash?.message && (
                    <div className="mb-6 p-5 bg-green-100 border-l-8 border-green-600 rounded-r-xl flex justify-between items-center shadow-lg animate-pulse">
                        <div>
                            <p className="text-green-800 font-black text-lg">{props.flash.message}</p>
                            <p className="text-sm text-green-700">El camión ya puede salir a ruta.</p>
                        </div>
                        {props.flash.despachoId && (
                            <a 
                                href={`/despachos/${props.flash.despachoId}/reporte`} 
                                target="_blank"
                                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 shadow-md transition-all hover:scale-105"
                            >
                                🖨️ IMPRIMIR HOJA DE RUTA
                            </a>
                        )}
                    </div>
                )}

                {/* Cuadro de Errores */}
                {Object.keys(errors).length > 0 && (
                    <div className="mb-6 bg-red-100 border-l-4 border-red-600 p-4 text-red-800 rounded shadow">
                        <p className="font-black">Error al procesar despacho:</p>
                        <p>{errors.chofer_id || errors.pedido_ids || "Revisa los datos seleccionados."}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna 1: Pedidos por asignar */}
                    <div className="lg:col-span-2 bg-white p-4 shadow rounded-lg border">
                        <h2 className="font-bold mb-4 italic text-gray-500 border-b pb-2">Preventas Pendientes</h2>
                        
                        {pedidosPendientes.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-4xl mb-4">✅</p>
                                <p className="text-gray-500 font-bold">No hay pedidos pendientes de carga.</p>
                            </div>
                        ) : (
                            pedidosPendientes.map(p => (
                                <label key={p.id} className={`flex items-center gap-3 border-b p-4 transition cursor-pointer hover:bg-gray-50 ${p.prioridad === 3 ? 'bg-red-50 border-l-4 border-red-500' : ''}`}>
                                    <input 
                                        type="checkbox" 
                                        className="w-6 h-6 rounded text-blue-600 cursor-pointer" 
                                        checked={data.pedido_ids.includes(p.id)}
                                        onChange={() => togglePedido(p.id)} 
                                    />
                                    <div className="flex-1">
                                        <span className="font-bold block text-gray-800 text-lg">{p.punto_venta.nombre_negocio}</span>
                                        <span className="text-[10px] uppercase font-black text-gray-500 tracking-tighter">
                                            {p.prioridad === 3 ? '🚨 URGENTE' : p.prioridad === 2 ? '⚠️ ALTA' : '📦 NORMAL'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black">
                                            {p.cantidad || 0} BOT.
                                        </span>
                                    </div>
                                </label>
                            ))
                        )}
                    </div>

                    {/* Columna 2: Asignación */}
                    <div className="bg-white p-8 shadow-2xl rounded-2xl border-t-8 border-blue-600 h-fit sticky top-6">
                        <label className="block font-black text-gray-700 mb-2 uppercase text-xs tracking-widest">1. Responsable del Viaje</label>
                        <select 
                            className="w-full border-gray-300 rounded-xl p-3 mb-8 shadow-sm focus:ring-blue-500" 
                            value={data.chofer_id}
                            onChange={e => setData('chofer_id', e.target.value)}
                        >
                            <option value="">-- Elige el Chofer --</option>
                            {choferes.map(c => (
                                <option key={c.id} value={c.id}>{c.user.name}</option>
                            ))}
                        </select>

                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 rounded-3xl text-center shadow-xl mb-8">
                            <p className="text-[10px] uppercase font-black opacity-70 tracking-widest mb-1">Carga Total Seleccionada</p>
                            <p className="text-6xl font-black">{data.pedido_ids.length}</p>
                            <p className="text-xs mt-2 font-bold italic opacity-90 underline">PEDIDOS A BORDO</p>
                        </div>

                        <button 
                            onClick={submit} 
                            disabled={processing || data.pedido_ids.length === 0 || !data.chofer_id}
                            className={`w-full p-5 rounded-2xl font-black text-lg uppercase transition-all shadow-lg active:scale-95 ${
                                (processing || data.pedido_ids.length === 0 || !data.chofer_id)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-dashed border-gray-300' 
                                : 'bg-green-600 text-white hover:bg-green-700 ring-4 ring-green-100'
                            }`}
                        >
                            {processing ? '⏳ PROCESANDO...' : '🚚 DESPACHAR AHORA'}
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
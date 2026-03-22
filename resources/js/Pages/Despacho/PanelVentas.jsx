import React from 'react';
import { useForm, Head, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PanelVentas({ auth, pedidosPendientes, choferes, despachosRecientes }) {
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
        post('/despachos/guardar', { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-black text-2xl text-gray-800 tracking-tight">🚀 Centro de Despacho</h2>}
        >
            <Head title="Mesa de Despacho" />

            <div className="p-6 max-w-[1600px] mx-auto space-y-8">
                
                {/* 1. Alerta de Éxito / Impresión */}
                {props.flash?.message && (
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-1 rounded-2 shadow-xl animate-fade-in-down">
                        <div className="bg-white p-4 rounded-xl flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-100 p-3 rounded-full text-2xl">✅</div>
                                <div>
                                    <p className="font-black text-green-900 text-lg uppercase">{props.flash.message}</p>
                                    <p className="text-sm text-green-600">El camión está listo para salir a ruta.</p>
                                </div>
                            </div>
                            {props.flash.despachoId && (
                                <a href={`/despachos/${props.flash.despachoId}/reporte`} target="_blank"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                                    🖨️ IMPRIMIR HOJA DE RUTA
                                </a>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    
                    {/* 2. Columna: Pedidos Pendientes (Mesa de Trabajo) */}
                    <div className="xl:col-span-3 space-y-6">
                        <div className="bg-white shadow-sm border border-gray-200 rounded-3xl overflow-hidden">
                            <div className="bg-gray-50 p-6 border-b flex justify-between items-center">
                                <h2 className="font-black text-gray-500 uppercase tracking-widest text-sm">📦 Preventas por Cargar</h2>
                                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                                    {pedidosPendientes?.length || 0} Disponibles
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-x border-t">
                                {pedidosPendientes?.length > 0 ? pedidosPendientes.map(p => (
                                    <label key={p.id} className={`group flex items-center gap-4 p-5 cursor-pointer transition-all hover:bg-blue-50 ${data.pedido_ids.includes(p.id) ? 'bg-blue-50/50 ring-2 ring-inset ring-blue-500' : ''}`}>
                                        <input type="checkbox" className="w-6 h-6 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
                                            checked={data.pedido_ids.includes(p.id)} onChange={() => togglePedido(p.id)} />
                                        
                                        <div className="flex-1">
                                            <span className="font-black text-gray-900 block group-hover:text-blue-700 transition-colors uppercase leading-tight">
                                                {p.punto_venta?.nombre_negocio}
                                            </span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold text-white ${p.prioridad === 3 ? 'bg-red-500' : p.prioridad === 2 ? 'bg-orange-400' : 'bg-gray-400'}`}>
                                                    {p.prioridad === 3 ? 'URGENTE' : p.prioridad === 2 ? 'ALTA' : 'NORMAL'}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium">#{p.id}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-2xl font-black text-blue-600">{p.cantidad}</span>
                                            <span className="block text-[9px] font-bold text-gray-400 uppercase">Botellones</span>
                                        </div>
                                    </label>
                                )) : (
                                    <div className="col-span-2 py-20 text-center text-gray-400 font-medium italic">Todo despachado. No hay pedidos pendientes.</div>
                                )}
                            </div>
                        </div>

                        {/* 3. Tabla: Despachos Recientes (Historial del Día) */}
                        <div className="bg-white shadow-sm border border-gray-200 rounded-3xl overflow-hidden">
                            <div className="bg-gray-50 p-6 border-b">
                                <h2 className="font-black text-gray-500 uppercase tracking-widest text-sm">🚚 Viajes en Ruta (Hoy)</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-400 border-b">
                                        <tr>
                                            <th className="p-4">ID Viaje</th>
                                            <th className="p-4">Chofer Responsable</th>
                                            <th className="p-4 text-center">Carga</th>
                                            <th className="p-4 text-center">Estado</th>
                                            <th className="p-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-sm">
                                        {despachosRecientes?.map(d => (
                                            <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-black text-blue-600">#{d.id}</td>
                                                <td className="p-4 font-bold text-gray-700 uppercase">{d.chofer?.user?.name}</td>
                                                <td className="p-4 text-center font-black text-gray-500">{d.pedidos_count || 0} ped.</td>
                                                <td className="p-4 text-center">
                                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">En Ruta</span>
                                                </td>
                                                <td className="p-4 text-right space-x-4">
                                                    <a href={`/despachos/${d.id}/reporte`} target="_blank" className="text-gray-400 hover:text-blue-600 font-bold text-xs uppercase">🖨️ Reporte</a>
                                                    <Link href={route('despachos.edit', d.id)} className="text-gray-400 hover:text-orange-600 font-bold text-xs uppercase">⚙️ Editar</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* 4. Columna: Acciones Rápidas (Sidebar) */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 shadow-2xl rounded-[2.5rem] border-t-8 border-blue-600 sticky top-6">
                            <h3 className="font-black text-gray-800 text-lg mb-6 uppercase tracking-tight text-center">Finalizar Despacho</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">1. Elegir Chofer</label>
                                    <select 
                                        className="w-full border-gray-200 rounded-2xl p-4 bg-gray-50 font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                        value={data.chofer_id} onChange={e => setData('chofer_id', e.target.value)}>
                                        <option value="">-- SELECCIONAR --</option>
                                        {choferes?.map(c => <option key={c.id} value={c.id}>{c.user?.name}</option>)}
                                    </select>
                                </div>

                                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2rem] text-center shadow-xl transform transition-transform hover:scale-105">
                                    <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] mb-1">Paquetes a Bordo</p>
                                    <p className="text-7xl font-black text-white">{data.pedido_ids.length}</p>
                                    <div className="h-1 w-12 bg-blue-400 mx-auto mt-4 rounded-full"></div>
                                </div>

                                <button 
                                    onClick={submit} 
                                    disabled={processing || !data.chofer_id || data.pedido_ids.length === 0}
                                    className={`w-full p-5 rounded-2xl font-black text-lg uppercase shadow-lg transition-all active:scale-95 ${
                                        processing || !data.chofer_id || data.pedido_ids.length === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-dashed'
                                        : 'bg-green-600 text-white hover:bg-green-700 ring-4 ring-green-50'
                                    }`}>
                                    {processing ? '⏳ PROCESANDO...' : '🚀 ENVIAR A RUTA'}
                                </button>
                                
                                {errors.chofer_id && <p className="text-red-500 text-center text-xs font-bold">{errors.chofer_id}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
import React, { useState } from 'react';
import { useForm, Head, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, pedidosPorAprobar }) {
    // 1. Extraemos post y processing del useForm
    const { post, processing } = useForm();
    // 2. Extraemos flash para ver los errores de límite de crédito
    const { flash } = usePage().props;
    const [verDetalle, setVerDetalle] = useState(null);

    // 3. Función para manejar el clic de facturación de forma segura
    const manejarFacturacion = (id) => {
        if (confirm('¿Deseas facturar y enviar este pedido a despacho?')) {
            post(route('pedidos.aprobar', id), {
                preserveScroll: true,
                onSuccess: () => {
                    setVerDetalle(null);
                    // Aquí puedes añadir una notificación de éxito
                }
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-black text-xl text-gray-800 uppercase tracking-tight">🏢 Validación y Facturación</h2>}>
            <Head title="Facturación" />
            
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                
                {/* --- MENSAJES DE ERROR (Límite de crédito, etc) --- */}
                {flash.error && (
                    <div className="bg-red-600 text-white p-4 rounded-2xl shadow-lg font-black animate-pulse flex items-center gap-3">
                        <span>⚠️</span> {flash.error}
                    </div>
                )}

                {/* --- MENSAJES DE ÉXITO --- */}
                {flash.message && (
                    <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg font-black flex items-center gap-3">
                        <span>✅</span> {flash.message}
                    </div>
                )}

                <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
                            <tr>
                                <th className="p-5">Pedido</th>
                                <th className="p-5">Cliente</th>
                                <th className="p-5 text-center">Pago</th>
                                <th className="p-5 text-right">Total</th>
                                <th className="p-5 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pedidosPorAprobar.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-5 font-black text-blue-600">#{p.id}</td>
                                    <td className="p-5 font-black uppercase text-slate-700">
                                        {p.punto_venta?.nombre_negocio}
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${p.metodo_pago === 'credito' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            {p.metodo_pago}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right font-black text-slate-800">${Number(p.total).toLocaleString()}</td>
                                    <td className="p-5 text-center flex items-center justify-center gap-3">
                                        <button onClick={() => setVerDetalle(p)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition">
                                            👁️
                                        </button>

                                        <Link href={route('facturacion.edit', p.id)} className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition">
                                            ✏️
                                        </Link>

                                        <button 
                                            onClick={() => manejarFacturacion(p.id)} // <--- USAMOS LA FUNCIÓN NUEVA
                                            disabled={processing}
                                            className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase shadow-md transition ${processing ? 'bg-gray-300' : 'bg-green-600 text-white hover:bg-green-700'}`}
                                        >
                                            {processing ? '⏳' : '✅ Facturar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL DE DETALLE RÁPIDO --- */}
            {verDetalle && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-black text-gray-800 uppercase tracking-tight">Detalle Pedido #{verDetalle.id}</h3>
                            <button onClick={() => setVerDetalle(null)} className="text-gray-400 hover:text-red-500 font-black text-xl">✕</button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <table className="w-full text-sm">
                                <thead className="text-[10px] uppercase font-black text-gray-400 border-b">
                                    <tr>
                                        <th className="pb-3 text-left">Producto</th>
                                        <th className="pb-3 text-center">Cant.</th>
                                        <th className="pb-3 text-center text-blue-600">Bono</th>
                                        <th className="pb-3 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {verDetalle.productos?.map(prod => (
                                        <tr key={prod.id}>
                                            <td className="py-4 font-bold uppercase text-xs">{prod.nombre}</td>
                                            <td className="py-4 text-center font-black">{prod.pivot?.cantidad}</td>
                                            <td className="py-4 text-center">
                                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-black">+{prod.pivot?.bono}</span>
                                            </td>
                                            <td className="py-4 text-right font-black">${Number(prod.pivot?.subtotal).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-8 bg-gray-900 flex justify-between items-center text-white">
                            <div>
                                <p className="text-[10px] opacity-50 uppercase font-black tracking-widest">Total Factura</p>
                                <p className="text-3xl font-black">${Number(verDetalle.total).toLocaleString()}</p>
                            </div>
                            <button 
                                onClick={() => manejarFacturacion(verDetalle.id)}
                                disabled={processing}
                                className="bg-green-500 px-8 py-3 rounded-xl font-black uppercase text-xs hover:bg-green-400 transition"
                            >
                                {processing ? 'Procesando...' : '✅ Facturar Ahora'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
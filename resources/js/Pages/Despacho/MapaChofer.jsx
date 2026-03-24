import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function MapaChofer({ auth, pedidos }) {
    const { post } = useForm();

    const finalizarEntrega = (id) => {
        if(confirm('¿Confirmar que entregaste este pedido?')) {
            post(route('pedidos.entregar_chofer', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-xl text-gray-800 leading-tight uppercase tracking-tighter">📍 Mi Ruta de Hoy</h2>}
        >
            <Head title="Mi Ruta" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
                {pedidos.length === 0 ? (
                    <div className="bg-white p-10 rounded-[2rem] text-center shadow-xl">
                        <p className="text-5xl mb-4">✅</p>
                        <p className="text-gray-500 font-bold italic text-lg">¡Felicidades! No tienes pedidos pendientes.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {pedidos.map((p) => (
                            <div key={p.id} className="bg-white p-6 rounded-[2rem] shadow-xl border-l-8 border-blue-500 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex-1">
                                    <h3 className="font-black text-xl text-gray-800 uppercase leading-tight">{p.punto_venta.nombre_negocio}</h3>
                                    <p className="text-sm text-gray-500 font-bold mt-1">{p.punto_venta.direccion}</p>
                                    <div className="mt-2 flex gap-2">
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                            {p.metodo_pago}
                                        </span>
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                            Total: ${p.total}
                                        </span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => finalizarEntrega(p.id)}
                                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all"
                                >
                                    ✅ ENTREGAR
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
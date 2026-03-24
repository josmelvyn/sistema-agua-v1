import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, choferes }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-black text-xl text-gray-800 uppercase tracking-tight">💰 Central de Liquidación</h2>}>
            <Head title="Caja - Liquidar" />
            
            <div className="p-6 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <p className="text-sm font-bold text-gray-500 italic">Selecciona un chofer para recibir el efectivo del día.</p>
                    {/* Botón opcional para ver cierres anteriores */}
                    <Link href="#" className="text-xs font-black text-blue-600 uppercase hover:underline">📂 Ver Historial de Cierres</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {choferes.length > 0 ? choferes.map(c => (
                        <div key={c.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col justify-between hover:ring-4 hover:ring-blue-50 transition-all group">
                            <div className="mb-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-blue-100 p-3 rounded-2xl text-2xl">🚚</div>
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Activo Hoy</span>
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Chofer Responsable</p>
                                <h3 className="text-2xl font-black text-gray-800 uppercase group-hover:text-blue-600 transition-colors leading-tight">
                                    {c.user.name}
                                </h3>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-blue-600 font-black text-lg">{c.pedidos_count}</span>
                                    <span className="text-xs text-gray-400 font-bold uppercase">Entregas Realizadas</span>
                                </div>
                            </div>

                            <Link 
                                href={route('caja.cuadre', c.id)}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs hover:bg-blue-600 shadow-lg transition-all text-center uppercase tracking-widest active:scale-95"
                            >
                                RECIBIR DINERO ➔
                            </Link>
                        </div>
                    )) : (
                        <div className="col-span-full bg-white p-20 rounded-[3rem] text-center shadow-inner border-2 border-dashed border-gray-100">
                            <p className="text-5xl mb-4">😴</p>
                            <p className="text-gray-400 font-bold text-lg uppercase tracking-tighter">No hay choferes con entregas registradas para hoy.</p>
                            <p className="text-xs text-gray-300 mt-2">Los choferes aparecerán aquí a medida que marquen pedidos como "entregados".</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
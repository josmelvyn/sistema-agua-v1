import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats }) {
    const rol = auth.user.rol;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-xl text-gray-800 leading-tight uppercase tracking-tighter">🚀 Panel de Control - Distribuidora</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* 1. ALERTAS DE STOCK (Solo Admin y Oficina) */}
                    {(rol === 'admin' || rol === 'oficina') && stats.stock_bajo.length > 0 && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">⚠️</span>
                                <p className="text-red-800 font-black uppercase text-xs tracking-widest">Alerta de Inventario Bajo</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {stats.stock_bajo.map(p => (
                                    <p key={p.id} className="text-sm text-red-700 font-bold bg-white/50 p-2 rounded">
                                        • {p.nombre}: <span className="text-red-900 font-black">{p.stock_actual}</span> unidades.
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 2. TARJETAS DE MÉTRICAS (Admin y Oficina) */}
                    {(rol === 'admin' || rol === 'oficina') && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                            <StatCard title="Clientes" value={stats.total_clientes} color="blue" icon="👥" />
                            <StatCard title="Ventas Hoy" value={`$${stats.ventas_hoy}`} color="green" icon="💰" />
                            <StatCard title="Por Facturar" value={stats.pedidos_pendientes} color="yellow" icon="📝" />
                            <StatCard title="Crédito Total" value={`$${stats.creditos_fuera}`} color="red" icon="💳" />
                        </div>
                    )}

                    {/* 3. BOTONES DE ACCIONES RÁPIDAS (Configurados por Rol) */}
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-2">Módulos del Sistema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* NUEVA PREVENTA (Admin, Preventista, Oficina) */}
                        {(rol === 'admin' || rol === 'preventista' || rol === 'oficina') && (
                            <Link href={route('pedidos.create')} className="bg-white p-8 rounded-[2.5rem] shadow-xl hover:scale-105 transition-all border-b-8 border-blue-500 flex flex-col items-center text-center group">
                                <span className="text-5xl mb-4 group-hover:animate-bounce">📝</span>
                                <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">Nueva Preventa</h3>
                                <p className="text-[10px] text-gray-400 mt-2 italic">Tomar pedido en calle</p>
                            </Link>
                        )}

                        {/* FACTURACIÓN (Admin, Oficina) */}
                        {(rol === 'admin' || rol === 'oficina') && (
                            <Link href={route('facturacion.index')} className="bg-white p-8 rounded-[2.5rem] shadow-xl hover:scale-105 transition-all border-b-8 border-emerald-500 flex flex-col items-center text-center group">
                                <span className="text-5xl mb-4 group-hover:animate-bounce">🏢</span>
                                <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">Validar y Facturar</h3>
                                <p className="text-[10px] text-gray-400 mt-2 italic">Aprobar pedidos de oficina</p>
                            </Link>
                        )}

                        {/* DESPACHO (Admin, Oficina, Despachador) */}
                        {(rol === 'admin' || rol === 'oficina' || rol === 'despachador') && (
                            <Link href={route('despachos.panel')} className="bg-white p-8 rounded-[2.5rem] shadow-xl hover:scale-105 transition-all border-b-8 border-orange-500 flex flex-col items-center text-center group">
                                <span className="text-5xl mb-4 group-hover:animate-bounce">🚚</span>
                                <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">Mesa de Despacho</h3>
                                <p className="text-[10px] text-gray-400 mt-2 italic">Cargar camiones y rutas</p>
                            </Link>
                        )}

                        {/* MÓDULO DE CAJA (Solo Admin y Oficina) */}
                       {(rol === 'admin' || rol === 'oficina') && (
                            <Link 
                                href={route('caja.index')} // <-- Cambiado a una ruta que no pide parámetros
                                className="bg-white p-8 rounded-[2.5rem] shadow-xl hover:scale-105 transition-all border-b-8 border-yellow-500 flex flex-col items-center text-center group"
                            >
                                <span className="text-5xl mb-4 group-hover:rotate-12 transition-transform">💰</span>
                                <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">Caja y Cuadre</h3>
                                <p className="text-[10px] text-gray-400 mt-2 italic">Seleccionar chofer para liquidar</p>
                            </Link>
                        )}

                        {/* MI RUTA (Solo Chofer) */}
                        {rol === 'chofer' && (
                            <Link href={route('despacho.mapa')} className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl hover:scale-105 transition-all border-b-8 border-cyan-400 flex flex-col items-center text-center text-white group">
                                <span className="text-5xl mb-4 group-hover:animate-pulse">📍</span>
                                <h3 className="font-black uppercase tracking-widest text-sm">Ver Mi Ruta</h3>
                                <p className="text-[10px] text-slate-500 mt-2 italic">Clientes a visitar hoy</p>
                            </Link>
                        )}

                        {/* CREAR CLIENTE (Admin y Oficina) */}
                        {(rol === 'admin' || rol === 'oficina') && (
                            <Link href={route('clientes.create')} className="bg-white p-8 rounded-[2.5rem] shadow-xl hover:scale-105 transition-all border-b-8 border-purple-500 flex flex-col items-center text-center group">
                                <span className="text-5xl mb-4 group-hover:rotate-12 transition-transform">🤝</span>
                                <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">Nuevo Cliente</h3>
                                <p className="text-[10px] text-gray-400 mt-2 italic">Registrar punto de venta</p>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Sub-componente para las tarjetas (Optimizado)
function StatCard({ title, value, color, icon }) {
    const colors = {
        blue: 'border-blue-500 text-blue-600 bg-blue-50/30',
        green: 'border-green-500 text-green-600 bg-green-50/30',
        yellow: 'border-yellow-500 text-yellow-600 bg-yellow-50/30',
        red: 'border-red-500 text-red-600 bg-red-50/30'
    };
    return (
        <div className={`p-6 rounded-[1.5rem] shadow-sm border-l-8 transition-transform hover:-translate-y-1 ${colors[color]}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{title}</p>
                    <p className="text-2xl font-black text-gray-800">{value}</p>
                </div>
                <span className="text-2xl opacity-50">{icon}</span>
            </div>
        </div>
    );
}
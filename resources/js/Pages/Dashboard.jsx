import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Panel de Control - Distribuidora</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Tarjetas de Métricas */}
                    {stats.stock_bajo.length > 0 && (
             <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
                    <p className="text-red-700 font-bold">⚠️ Alerta de Inventario Bajo:</p>
                    {stats.stock_bajo.map(p => (
                    <p key={p.id} className="text-sm text-red-600">- {p.nombre}: Solo quedan {p.stock_actual} unidades.</p>
                     ))}
                    </div>
)}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <StatCard title="Clientes" value={stats.total_clientes} color="blue" />
                        <StatCard title="Ventas Hoy" value={`$${stats.ventas_hoy}`} color="green" />
                        <StatCard title="Pendientes" value={stats.pedidos_pendientes} color="yellow" />
                        <StatCard title="Crédito Total" value={`$${stats.creditos_fuera}`} color="red" />
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Acciones Rápidas</h3>
                        <div className="flex gap-4">
                            <a href="/clientes/nuevo" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                + Nuevo Cliente
                            </a>
                            <a href="/preventa/nueva" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                + Nueva Preventa
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Sub-componente para las tarjetas
function StatCard({ title, value, color }) {
    const colors = {
        blue: 'border-blue-500 text-blue-600',
        green: 'border-green-500 text-green-600',
        yellow: 'border-yellow-500 text-yellow-600',
        red: 'border-red-500 text-red-600'
    };
    return (
        <div className={`bg-white p-6 rounded-lg shadow border-l-4 ${colors[color]}`}>
            <p className="text-sm font-medium uppercase text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}
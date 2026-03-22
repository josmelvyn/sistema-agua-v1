import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, pedidosPorAprobar }) {
    const { post, processing } = useForm();

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-black text-xl">🏢 Validación y Facturación</h2>}>
            <Head title="Facturación" />
            <div className="p-6 max-w-7xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-400">
                            <tr>
                                <th className="p-4">Pedido</th>
                                <th className="p-4">Cliente</th>
                                <th className="p-4">Pago</th>
                                <th className="p-4 text-right">Total</th>
                                <th className="p-4 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {pedidosPorAprobar.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-bold">#{p.id}</td>
                                    <td className="p-4 uppercase font-black">{p.punto_venta.nombre_negocio}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${p.metodo_pago === 'credito' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                            {p.metodo_pago}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-black">${p.total}</td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => post(route('pedidos.aprobar', p.id))}
                                            disabled={processing}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 shadow-md"
                                        >
                                            🚀 FACTURAR Y ENVIAR
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

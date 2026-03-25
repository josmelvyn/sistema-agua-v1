import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Cuadre({ auth, totales, chofer, fecha, detalles }) {
    const [entregado, setEntregado] = useState(0);
    const { data, setData, post, processing } = useForm({
    chofer_id: chofer.id,
    efectivo_entregado: 0,
    efectivo_esperado: totales.efectivo_esperado
});


    const diferencia = Number(entregado) - Number(totales?.efectivo_esperado || 0);

    const finalizar = (e) => {
        e.preventDefault();
        post(route('caja.finalizar'));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-black text-xl text-gray-800 uppercase">💰 Liquidación: {chofer.user.name}</h2>}>
            <Head title="Cuadre de Caja" />
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Resumen Sistema */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Resumen del Sistema</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-bold text-gray-500 uppercase text-xs">Efectivo Esperado:</span>
                                <span className="font-black text-xl text-green-600">${totales?.efectivo_esperado || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold text-gray-500 uppercase text-xs">Envases Recogidos:</span>
                                <span className="font-black text-gray-800">{totales?.total_envases_recogidos || 0} und.</span>
                            </div>
                        </div>
                    </div>

                    {/* --- TABLA DE AUDITORÍA DE PEDIDOS --- */}
<div className="bg-white shadow-xl rounded-[2rem] overflow-hidden border border-gray-100 mt-8">
    <div className="bg-gray-50 p-6 border-b flex justify-between items-center">
        <h3 className="font-black text-gray-700 uppercase text-xs tracking-widest">📋 Auditoría de Entregas ({detalles.length})</h3>
        <span className="text-[10px] text-gray-400 italic">Revisa si hay pedidos duplicados aquí</span>
    </div>
    <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 sticky top-0 text-[10px] font-black text-gray-400 uppercase border-b">
                <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Cliente</th>
                    <th className="p-4 text-center">Tipo</th>
                    <th className="p-4 text-right">Monto</th>
                    <th className="p-4 text-center">Hora</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {detalles.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="p-4 font-bold text-blue-600">#{p.id}</td>
                        <td className="p-4 font-black uppercase text-xs">{p.punto_venta?.nombre_negocio}</td>
                        <td className="p-4 text-center">
                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${p.metodo_pago === 'credito' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                {p.metodo_pago}
                            </span>
                        </td>
                        <td className="p-4 text-right font-black text-gray-700">
                            ${Number(p.total).toLocaleString()}
                        </td>
                        <td className="p-4 text-center text-[10px] text-gray-400">
                            {new Date(p.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    <div className="p-4 bg-gray-50 border-t text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase">
            Suma Total en Tabla: <span className="text-gray-900">${detalles.reduce((acc, p) => acc + Number(p.total), 0).toLocaleString()}</span>
        </p>
    </div>
</div>

                    {/* Conteo Físico */}
                    <div className="bg-gray-900 p-8 rounded-[2rem] shadow-xl text-white">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 tracking-widest">Dinero Recibido</h3>
                       <input 
                                type="number" 
                                className="w-full bg-slate-800 border-2 border-slate-700 rounded-3xl p-6 pl-12 text-5xl font-black text-green-400 outline-none focus:ring-4 focus:ring-blue-500/50 transition-all text-center"
                                placeholder="0.00"
                                value={data.efectivo_entregado} // Conectado al formulario
                                onChange={(e) => {
                                    const valor = e.target.value;
                                    setEntregado(valor); // Para el cálculo visual de la diferencia
                                    setData('efectivo_entregado', valor); // Para enviar a Laravel
                                }}
                            />
                        <div className={`p-4 rounded-2xl text-center font-black uppercase text-xs ${diferencia === 0 ? 'bg-green-500/20 text-green-400' : (diferencia < 0 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400')}`}>
                            {diferencia === 0 ? '✅ CUADRE EXACTO' : (diferencia < 0 ? `❌ FALTAN $${Math.abs(diferencia)}` : `⚠️ SOBRAN $${diferencia}`)}
                        </div>
                    </div>
                </div>

                <button 
                onClick={(e) => {
                    e.preventDefault();
                    if(confirm('¿Confirmar liquidación? Si hay faltante se cargará a la cuenta del chofer.')) {
                        post(route('caja.finalizar'), {
                            preserveScroll: true,
                            onSuccess: () => alert("Liquidación completada")
                        });
                    }
                }}
                disabled={processing || data.efectivo_entregado === 0}
                className={`w-full p-5 rounded-2xl font-black text-xl shadow-lg transition-all active:scale-95 ${
                    processing 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                }`}
                >
                {processing ? '🔄 PROCESANDO...' : '🔒 CERRAR Y LIQUIDAR DÍA'}
            </button>
            </div>
        </AuthenticatedLayout>
    );
}
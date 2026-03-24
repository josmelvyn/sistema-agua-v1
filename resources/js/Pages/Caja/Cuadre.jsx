import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Cuadre({ auth, totales, chofer, fecha }) {
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
import React from 'react';
import { Head } from '@inertiajs/react';

export default function ReporteGeneral({ resumen, choferes, fecha }) {
    const totalEfectivo = resumen.find(r => r.metodo_pago === 'contado')?.monto || 0;
    const totalCredito = resumen.find(r => r.metodo_pago === 'credito')?.monto || 0;

    return (
        <div className="p-10 bg-white min-h-screen text-black font-mono">
            <Head title="Reporte de Caja Diario" />
            
            <div className="text-center border-b-2 border-black pb-4 mb-6">
                <h1 className="text-2xl font-black">REPORTE DE CAJA DIARIO</h1>
                <p className="text-sm uppercase font-bold">Distribuidora de Agua</p>
                <p className="text-lg font-bold">FECHA: {fecha}</p>
            </div>

            {/* RESUMEN DE VENTAS */}
            <div className="mb-8">
                <h2 className="bg-black text-white px-2 py-1 inline-block mb-4">1. RESUMEN DE INGRESOS</h2>
                <div className="grid grid-cols-2 gap-4 border-2 border-black p-4">
                    <div>
                        <p className="text-xs font-bold uppercase text-gray-500">Total Efectivo (Contado)</p>
                        <p className="text-3xl font-black">${totalEfectivo.toLocaleString()}</p>
                    </div>
                    <div className="border-l-2 border-black pl-4">
                        <p className="text-xs font-bold uppercase text-gray-500">Total Cuentas por Cobrar (Crédito)</p>
                        <p className="text-3xl font-black">${totalCredito.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* DETALLE POR CHOFER */}
            <div className="mb-8">
                <h2 className="bg-black text-white px-2 py-1 inline-block mb-4">2. LIQUIDACIÓN DE CHOFERES</h2>
                <table className="w-full border-collapse border-2 border-black">
                    <thead>
                        <tr className="bg-gray-100 border-b-2 border-black">
                            <th className="p-2 border-r-2 border-black text-left">CHOFER</th>
                            <th className="p-2 border-r-2 border-black text-center">PEDIDOS</th>
                            <th className="p-2 border-r-2 border-black text-right">EFECTIVO</th>
                            <th className="p-2 text-right">FALTANTE/DEUDA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {choferes.map((c) => (
                            <tr key={c.id} className="border-b border-black">
                                <td className="p-2 border-r-2 border-black uppercase font-bold">{c.user.name}</td>
                                <td className="p-2 border-r-2 border-black text-center">{c.pedidos_count}</td>
                                <td className="p-4 border-r-2 border-black text-right font-black">${c.efectivo_ruta}</td>
                                <td className="p-2 text-right text-red-600 font-bold">-${c.deuda_pendiente}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-20 grid grid-cols-2 gap-20 text-center uppercase text-xs font-black">
                <div className="border-t-2 border-black pt-2">Firma del Cajero</div>
                <div className="border-t-2 border-black pt-2">Firma Gerencia</div>
            </div>

            <button onClick={() => window.print()} className="no-print mt-10 bg-blue-600 text-white px-6 py-3 rounded-xl font-black shadow-lg">
                🖨️ IMPRIMIR REPORTE FINAL
            </button>

            <style>{`@media print { .no-print { display: none; } }`}</style>
        </div>
    );
}
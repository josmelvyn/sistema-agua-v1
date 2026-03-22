import React from 'react';

export default function Liquidacion({ resumen, chofer }) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white shadow-2xl rounded-lg border-2 border-gray-200 mt-10">
    <div className="text-center border-b pb-4 mb-4">
        <h1 className="text-2xl font-black uppercase">Reporte de Liquidación</h1>
        <p className="text-gray-500">Chofer: {chofer.user.name}</p>
        <p className="text-sm">Fecha: {new Date().toLocaleDateString()}</p>
    </div>
    
    <div className="space-y-4">
        {/* Sección de Dinero */}
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="font-bold text-green-800">Efectivo a Entregar:</span>
            <span className="text-2xl font-black text-green-600">${resumen.total_efectivo}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="font-bold text-blue-800">Ventas a Crédito:</span>
            <span className="text-xl font-bold text-blue-600">${resumen.total_credito}</span>
        </div>

        {/* NUEVA SECCIÓN: Control de Envases */}
        <div className="grid grid-cols-2 gap-2 mt-4 border-t pt-4">
            <div className="p-2 bg-gray-50 rounded text-center">
                <p className="text-xs text-gray-500 uppercase">Entregados (Llenos)</p>
                <p className="text-lg font-bold">{resumen.total_entregados || 0}</p>
            </div>
            <div className="p-2 bg-orange-50 rounded text-center border border-orange-100">
                <p className="text-xs text-orange-700 uppercase">Recogidos (Vacíos)</p>
                <p className="text-lg font-bold text-orange-800">{resumen.total_recogidos || 0}</p>
            </div>
        </div>

        {/* Alerta de envases faltantes */}
        {resumen.total_entregados > resumen.total_recogidos && (
            <div className="text-center p-2 bg-red-50 rounded">
                <p className="text-xs text-red-600">
                    ⚠️ Faltan <b>{resumen.total_entregados - resumen.total_recogidos}</b> envases por retornar (en préstamo).
                </p>
            </div>
        )}

        <div className="flex justify-between items-center p-3 border-t">
            <span className="font-medium text-gray-600">Total Entregas:</span>
            <span className="font-bold">{resumen.total_entregas} PDV</span>
        </div>
    </div>

    <button onClick={() => window.print()} className="w-full mt-6 bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-black no-print">
        🖨️ Imprimir Liquidación
    </button>
</div>
    );
}
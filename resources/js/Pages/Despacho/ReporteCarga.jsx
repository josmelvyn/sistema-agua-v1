import React from 'react';
import { Head } from '@inertiajs/react';

export default function ReporteCarga({ despacho, resumen, clientes }) {
    // Función para disparar la ventana de impresión del navegador
    const imprimir = () => window.print();

    return (
        <div className="p-10 bg-white min-h-screen text-black font-sans">
            <Head title={`Hoja de Ruta #${despacho?.id}`} />
            
            {/* --- CABECERA DEL REPORTE --- */}
            <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">ORDEN DE CARGA #00{despacho?.id}</h1>
                    <p className="text-xl uppercase font-bold text-gray-600 tracking-widest">Distribuidora de Agua</p>
                </div>
                <div className="text-right">
                    <button 
                        onClick={imprimir} 
                        className="no-print bg-black text-white px-8 py-3 rounded-xl font-black hover:bg-gray-800 transition-all active:scale-95 mb-2 shadow-lg"
                    >
                        🖨️ IMPRIMIR REPORTE
                    </button>
                    <p className="font-mono text-xs text-gray-500 uppercase">Generado: {new Date().toLocaleString()}</p>
                </div>
            </div>

            {/* --- DATOS GENERALES DEL DESPACHO --- */}
            <div className="grid grid-cols-3 gap-6 mb-10 bg-gray-50 p-6 rounded-3xl border-2 border-gray-100">
                <div className="border-r border-gray-200">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Chofer Responsable</p>
                    <p className="text-2xl font-black uppercase text-blue-900">{despacho?.chofer?.user?.name || 'NO ASIGNADO'}</p>
                </div>
                <div className="border-r border-gray-200 px-4">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Vehículo / Placa</p>
                    <p className="text-2xl font-black uppercase">{despacho?.placa_vehiculo || 'S/P'}</p>
                </div>
                <div className="px-4">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Total Clientes</p>
                    <p className="text-2xl font-black uppercase">{clientes?.length || 0}</p>
                </div>
            </div>

            {/* --- 1. RESUMEN DE CARGA (Para que el despachador llene el camión) --- */}
            <div className="mb-12">
                <h2 className="text-2xl font-black mb-4 bg-black text-white px-6 py-2 inline-block skew-x-[-10deg]">
                    1. CARGA TOTAL DEL CAMIÓN
                </h2>
                <table className="w-full border-4 border-black">
                    <thead>
                        <tr className="bg-gray-200 border-b-4 border-black">
                            <th className="p-4 text-left border-r-4 border-black text-lg">PRODUCTO</th>
                            <th className="p-4 text-center border-r-2 border-black">VENTA</th>
                            <th className="p-4 text-center border-r-2 border-black text-blue-700">OFERTA</th>
                            <th className="p-4 text-center bg-yellow-100 text-2xl font-black">TOTAL CARGA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resumen && resumen.map((item, i) => {
                            const venta = Number(item.venta_real) || Number(item.total) || 0;
                            const bono = Math.floor(venta / 10);
                            const cargaTotal = venta + bono;

                            return (
                                <tr key={i} className="border-b-2 border-gray-300 h-20">
                                    <td className="p-4 font-black uppercase text-xl border-r-4 border-black">{item.nombre}</td>
                                    <td className="p-4 text-center text-2xl border-r-2 border-black font-bold">{venta}</td>
                                    <td className="p-4 text-center text-2xl border-r-2 border-black text-blue-700 font-black">
                                        {bono > 0 ? `+${bono}` : '-'}
                                    </td>
                                    <td className="p-4 text-center text-5xl font-black bg-yellow-50">
                                        {cargaTotal}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <p className="mt-2 text-xs italic text-gray-500">* La columna TOTAL CARGA ya incluye las bonificaciones de regalo.</p>
            </div>

            {/* --- 2. HOJA DE ENTREGAS (Ruta para el Chofer) --- */}
            <div>
                <h2 className="text-2xl font-black mb-4 bg-black text-white px-6 py-2 inline-block skew-x-[-10deg]">
                    2. HOJA DE RUTA / ENTREGAS
                </h2>
                <table className="w-full border-2 border-black text-sm">
                    <thead>
                        <tr className="bg-gray-200 border-b-2 border-black">
                            <th className="p-2 border-r w-12 text-center">ORD.</th>
                            <th className="p-2 border-r text-left">NEGOCIO / CLIENTE</th>
                            <th className="p-2 border-r text-center">VENTA</th>
                            <th className="p-2 border-r text-center text-blue-700">BONO</th>
                            <th className="p-2 border-r text-center bg-gray-100">TOTAL</th>
                            <th className="p-2 text-center">RECIBIDO (FIRMA/SELLO)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes && clientes.map((p, i) => {
                            // FIX: Convertimos a números para evitar el error NaN
                            const cantPedido = Number(p.cantidad) || 0;
                            const reg = Math.floor(cantPedido / 10);
                            const sumaTotal = cantPedido + reg;

                            return (
                                <tr key={p.id || i} className="border-b border-gray-400 h-20">
                                    <td className="p-2 text-center font-bold border-r bg-gray-50">{i + 1}</td>
                                    <td className="p-2 border-r">
                                        <span className="font-black uppercase block text-sm leading-tight">
                                            {p.punto_venta?.nombre_negocio || 'SIN NOMBRE'}
                                        </span>
                                        <span className="text-[10px] text-gray-500 block italic leading-none mt-1">
                                            {p.punto_venta?.direccion || 'Sin dirección registrada'}
                                        </span>
                                    </td>
                                    <td className="p-2 border-r text-center font-bold text-lg">{cantPedido}</td>
                                    <td className="p-2 border-r text-center text-blue-700 font-black text-lg">
                                        {reg > 0 ? `+${reg}` : '-'}
                                    </td>
                                    <td className="p-2 border-r text-center font-black bg-gray-100 text-2xl">
                                        {sumaTotal}
                                    </td>
                                    <td className="p-2 text-center border-dashed border-l-2 border-gray-300 text-gray-200 font-bold italic text-[9px] flex flex-col justify-end h-full">
                                        <div className="border-t border-gray-400 mt-10 w-full pt-1">FECHA / HORA</div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* --- PIE DE PÁGINA / FIRMAS --- */}
            <div className="mt-16 grid grid-cols-2 gap-20 text-center">
                <div className="border-t-2 border-black pt-4">
                    <p className="font-black uppercase">Firma Despachador</p>
                    <p className="text-xs text-gray-400">Salida de Almacén</p>
                </div>
                <div className="border-t-2 border-black pt-4">
                    <p className="font-black uppercase">Firma Chofer</p>
                    <p className="text-xs text-gray-400">Responsable de Carga</p>
                </div>
            </div>

            {/* Estilo CSS para ocultar el botón al imprimir */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { padding: 0; margin: 0; background: white; }
                    .p-10 { padding: 0.5in !important; }
                    table { page-break-inside: auto; }
                    tr { page-break-inside: avoid; page-break-after: auto; }
                }
            `}} />
        </div>
    );
}
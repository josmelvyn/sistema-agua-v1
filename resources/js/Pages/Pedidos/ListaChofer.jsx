import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function ListaChofer({ auth, pedidosPendientes }) {
    
    const confirmarEntrega = (id, metodo) => {
        const envases = prompt("¿Cuántos envases vacíos recogió?", "0");
        if (envases !== null) {
            router.patch(`/pedidos/${id}/entregar`, { 
                metodo_pago: metodo,
                envases_recogidos: envases 
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-bold text-xl">Entregas del Día</h2>}>
            <Head title="Mis Entregas" />
            <div className="py-6 px-4 max-w-lg mx-auto space-y-4">
                {pedidosPendientes.length === 0 && (
                    <div className="text-center p-10 bg-white rounded shadow text-gray-500 italic">
                        No hay pedidos pendientes para entregar.
                    </div>
                )}

                {pedidosPendientes.map((pedido) => (
                    <div key={pedido.id} className="bg-white p-5 rounded-xl shadow-md border-l-8 border-yellow-400">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-black text-lg text-gray-800">{pedido.punto_venta.nombre_negocio}</h3>
                                <p className="text-sm text-gray-500">{pedido.punto_venta.direccion}</p>
                            </div>
                            <a href={`https://www.google.com{pedido.punto_venta.latitud},${pedido.punto_venta.longitud}`} 
                               target="_blank" className="bg-blue-500 text-white p-2 rounded-lg shadow-lg">
                               📍 Ir
                            </a>
                        </div>

                        <div className="mt-4 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                            <span className="text-sm">Cantidad: <strong>{pedido.cantidad} + {pedido.regalos} (Regalo)</strong></span>
                            <span className="text-lg font-bold text-blue-700">${pedido.total}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-5">
                            <button onClick={() => confirmarEntrega(pedido.id, 'efectivo')}
                                className="bg-green-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-green-700">
                                💵 Efectivo
                            </button>
                            <button onClick={() => confirmarEntrega(pedido.id, 'credito')}
                                className="bg-orange-500 text-white py-3 rounded-lg font-bold shadow-md hover:bg-orange-600">
                                💳 Crédito
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
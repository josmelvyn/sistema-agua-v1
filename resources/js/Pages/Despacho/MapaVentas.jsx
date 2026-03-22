import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '600px' };
const center = { lat: 18.4861, lng: -69.9312 }; // Coordenadas de tu ciudad (ej: Sto Dgo)

export default function MapaVentas({ pedidos, choferes }) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "TU_API_KEY_AQUI"
    });

    return isLoaded ? (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Mapa de Despacho en Tiempo Real</h1>
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3 shadow-xl rounded-lg overflow-hidden border-4 border-white">
                    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
                        {pedidos.map(p => (
                            <Marker 
                                key={p.id} 
                                position={{ lat: parseFloat(p.punto_venta.latitud), lng: parseFloat(p.punto_venta.longitud) }}
                                title={p.punto_venta.nombre_negocio}
                                icon={p.prioridad === 3 ? "http://maps.google.com" : "http://maps.google.com"}
                            />
                        ))}
                    </GoogleMap>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <h2 className="font-bold border-b pb-2 mb-3">Resumen Geográfico</h2>
                    <p className="text-sm">📍 Pedidos en espera: <strong>{pedidos.length}</strong></p>
                    <div className="mt-4 space-y-2">
                        <p className="text-xs text-red-600 font-bold">● Urgentes (Rojo)</p>
                        <p className="text-xs text-blue-600 font-bold">● Normales (Azul)</p>
                    </div>
                </div>
            </div>
        </div>
    ) : <p>Cargando Mapa...</p>;
}
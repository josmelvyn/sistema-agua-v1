import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ auth, rutas }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre_negocio: '', dueño: '', cedula_rnc: '', telefono: '',
        direccion: '', ruta_id: '', latitud: '', longitud: '',
        limite_credito: 0, capacidad_anaquel: ''
    });

    const getGPS = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setData(prev => ({ ...prev, latitud: pos.coords.latitude, longitud: pos.coords.longitude }));
            alert("📍 Ubicación capturada");
        });
    };

    const submit = (e) => { e.preventDefault(); post(route('clientes.store')); };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-bold text-xl">Nuevo Cliente (PDV)</h2>}>
            <Head title="Registrar Cliente" />
            <div className="py-12"><div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
                <form onSubmit={submit} className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-bold">Nombre del Negocio</label>
                        <input type="text" className="w-full border rounded p-2" onChange={e => setData('nombre_negocio', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold">Dueño</label>
                        <input type="text" className="w-full border rounded p-2" onChange={e => setData('dueño', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold">Cédula / RNC</label>
                        <input type="text" className="w-full border rounded p-2" onChange={e => setData('cedula_rnc', e.target.value)} />
                    </div>
                    {/* Campo Teléfono */}
<div>
    <label className="block text-sm font-bold italic">Teléfono / WhatsApp</label>
    <input type="text" className="w-full border rounded p-2" 
        onChange={e => setData('telefono', e.target.value)} required />
    {errors.telefono && <div className="text-red-500 text-xs">{errors.telefono}</div>}
</div>

{/* Campo Dirección */}
<div className="col-span-2">
    <label className="block text-sm font-bold italic">Dirección Exacta</label>
    <textarea className="w-full border rounded p-2" 
        onChange={e => setData('direccion', e.target.value)} required />
</div>

{/* Campo Capacidad Anaquel */}
<div>
    <label className="block text-sm font-bold italic">Capacidad Anaquel (Botellones)</label>
    <input type="number" className="w-full border rounded p-2" 
        placeholder="Ej: 10" onChange={e => setData('capacidad_anaquel', e.target.value)} />
</div>
                    <div>
                        <label className="block text-sm font-bold">Ruta de Entrega</label>
                        <select className="w-full border rounded p-2" onChange={e => setData('ruta_id', e.target.value)}>
                            <option value="">Seleccione Ruta</option>
                            {rutas.map(r => <option key={r.id} value={r.id}>{r.nombre_ruta}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold">Límite Crédito ($)</label>
                        <input type="number" className="w-full border rounded p-2" onChange={e => setData('limite_credito', e.target.value)} />
                    </div>
                    <div className="col-span-2 border-t pt-4">
                        <button type="button" onClick={getGPS} className="bg-green-600 text-white px-4 py-2 rounded text-sm mb-4">
                            📍 Capturar Ubicación GPS Actual
                        </button>
                    </div>
                    <button disabled={processing} className="col-span-2 bg-blue-700 text-white py-3 rounded-lg font-bold">
                        {processing ? 'Guardando...' : 'Registrar Cliente'}
                    </button>
                </form>
            </div></div>
        </AuthenticatedLayout>
    );
}
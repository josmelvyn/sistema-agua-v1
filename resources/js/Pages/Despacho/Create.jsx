import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';

export default function Create({ auth, choferes, rutas }) {
    const { data, setData, post, processing } = useForm({
        chofer_id: '',
        ruta_id: '',
        cantidad_carga: 0
    });

    const submit = (e) => { e.preventDefault(); post('/despachos/guardar'); };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-bold">Despacho de Camiones</h2>}>
            <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow-lg border-t-4 border-orange-500">
                <form onSubmit={submit} className="space-y-4">
                    <label className="block font-bold">Seleccionar Chofer</label>
                    <select className="w-full border p-2" onChange={e => setData('chofer_id', e.target.value)}>
                        <option value="">Seleccione Chofer...</option>
                        {choferes.map(c => <option key={c.id} value={c.id}>{c.user.name}</option>)}
                    </select>

                    <label className="block font-bold">Ruta Asignada</label>
                    <select className="w-full border p-2" onChange={e => setData('ruta_id', e.target.value)}>
                        {rutas.map(r => <option key={r.id} value={r.id}>{r.nombre_ruta}</option>)}
                    </select>

                    <label className="block font-bold">Cantidad de Botellones (Carga Inicial)</label>
                    <input type="number" className="w-full border p-2" 
                        onChange={e => setData('cantidad_carga', e.target.value)} />

                    <button disabled={processing} className="w-full bg-orange-600 text-white p-3 rounded font-bold uppercase">
                        Autorizar Salida de Camión
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
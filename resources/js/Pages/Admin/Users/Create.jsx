import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', password: '', password_confirmation: '', rol: 'chofer'
    });

    const submit = (e) => { e.preventDefault(); post('/usuarios/guardar'); };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-bold">Registrar Empleado</h2>}>
            <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
                <form onSubmit={submit} className="space-y-4">
                    <input type="text" placeholder="Nombre" className="w-full border p-2" onChange={e => setData('name', e.target.value)} />
                    <input type="email" placeholder="Email" className="w-full border p-2" onChange={e => setData('email', e.target.value)} />
                    {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
                    <input type="password" placeholder="Contraseña" className="w-full border p-2" onChange={e => setData('password', e.target.value)} />
                    {errors.password && <div className="text-red-500 text-xs">{errors.password}</div>}
                    <input type="password" placeholder="Confirmar" className="w-full border p-2" onChange={e => setData('password_confirmation', e.target.value)} />
                    <select className="w-full border p-2" onChange={e => setData('rol', e.target.value)}>
                        <option value="chofer">Chofer</option>
                        <option value="vendedor">Vendedor (Preventa)</option>
                        <option value="admin">Administrador</option>
                         {errors.rol && <div className="text-red-500 text-xs mt-1">{errors.rol}</div>}
                    </select>

                    <button disabled={processing} className="w-full bg-black text-white p-2 rounded">Crear Usuario</button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
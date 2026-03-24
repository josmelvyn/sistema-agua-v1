import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ user, header, children }) {
    // 1. FIX: Extraemos auth de usePage().props para tener los datos de sesión frescos
    const { auth } = usePage().props;
    const rol = auth.user?.rol; // 'admin', 'oficina', 'preventista', 'chofer'
    
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white sticky top-0 z-50 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-blue-600" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>

                                {/* --- SECCIÓN VENTAS (Admin, Oficina, Preventista) --- */}
                                {(rol === 'admin' || rol === 'oficina' || rol === 'preventista') && (
                                    <NavLink href={route('pedidos.create')} active={route().current('pedidos.create')}>
                                        📝 Nueva Preventa
                                    </NavLink>
                                )}

                                {/* --- SECCIÓN OFICINA (Admin, Oficina) --- */}
                                {(rol === 'admin' || rol === 'oficina') && (
                                    <>
                                        <NavLink href={route('facturacion.index')} active={route().current('facturacion.index')}>
                                            🏢 Facturación
                                        </NavLink>
                                        <NavLink href={route('ventanilla.create')} active={route().current('ventanilla.create')}>
                                            🏃 Ventanilla
                                        </NavLink>
                                        <NavLink href={route('despachos.panel')} active={route().current('despachos.panel')}>
                                            🚚 Despacho
                                        </NavLink>
                                    </>
                                )}

                                {/* --- SECCIÓN SOLO ADMIN (Gestión) --- */}
                                {rol === 'admin' && (
                                    <>
                                        <NavLink href={route('usuarios.create')} active={route().current('usuarios.create')}>
                                            👥 Personal
                                        </NavLink>
                                        <NavLink href={route('productos.index')} active={route().current('productos.index')}>
                                            📦 Inventario
                                        </NavLink>
                                        <NavLink href={route('clientes.create')} active={route().current('clientes.create')}>
                                            🤝 Clientes
                                        </NavLink>
                                    </>
                                )}
                                {(rol === 'admin' || rol === 'oficina') && (
                                     <>
        
                                {/* Aquí podrías mapear los choferes o simplemente poner un link a una lista de liquidación */}
                                <Link href={route('facturacion.index')} className="flex items-center gap-3 p-3 hover:bg-emerald-600/20 text-emerald-400 rounded-xl font-bold text-sm transition">
                                    <span className="text-lg">💰</span> Liquidar Choferes
                                </Link>
                                     </>
                                 )}

                                {/* --- SECCIÓN SOLO CHOFERES --- */}
                                {rol === 'chofer' && (
                                    <NavLink href={route('despacho.chofer')}className="flex items-center gap-3 p-3 hover:bg-emerald-600/20 text-emerald-400 rounded-xl font-bold text-sm transition" active={route().current('pedidos.chofer')}>
                                         <span className="text-lg">🚚</span> Mis Entregas
                                    </NavLink>
                                    
                                )}
                            </div>
                        </div>

                        {/* Dropdown de Usuario */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition hover:text-gray-700 focus:outline-none">
                                                <span className="font-bold text-blue-600 mr-1">[{rol}]</span> {user.name}
                                                <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">Cerrar Sesión</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Encabezado de Página */}
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {/* Contenido Principal */}
            <main>{children}</main>
        </div>
    );
}
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ImRocket } from 'react-icons/im';
import { FiLogOut } from 'react-icons/fi';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className=" flex justify-center items-center w-full h-[70px] bg-white shadow-md px-4 md:px-20">
            <div className="flex items-center justify-between container h-full">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
                    <span className="hidden md:block text-xl font-bold text-teal-700">Hosti</span>
                    <ImRocket className="text-3xl text-teal-600" />
                </Link>

                {/* Menú central */}
                {/* <section className="flex justify-center items-center flex-1">
                    <ul className="flex gap-4 md:gap-10">
                        {isAuthenticated ? (
                            <>
                                <li>
                                    <Link
                                        to="/dashboard"
                                        className={`hover:text-teal-600 transition font-medium ${
                                            isActive('/dashboard') ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-700'
                                        }`}
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/projects/new"
                                        className={`hover:text-teal-600 transition font-medium ${
                                            isActive('/projects/new') ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-700'
                                        }`}
                                    >
                                        Nuevo Proyecto
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/" className="hover:text-teal-600 transition text-gray-700 font-medium">
                                        Inicio
                                    </Link>
                                </li>
                                <li className="hidden md:block">
                                    <a href="#features" className="hover:text-teal-600 transition text-gray-700 font-medium">
                                        Características
                                    </a>
                                </li>
                                <li className="hidden md:block">
                                    <a href="#docs" className="hover:text-teal-600 transition text-gray-700 font-medium">
                                        Documentación
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>
                </section> */}

                {/* Botones derecha */}
                <section className="flex items-center gap-6">
                    {isAuthenticated ? (
                        <>
                            {user && (
                                <span className="hidden md:block text-sm text-gray-600 font-medium">
                                    {user.name}
                                </span>
                            )}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition btn-secondary"
                            >
                                <FiLogOut />
                                <span className="hidden md:inline">Salir</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition btn-primary"
                            >
                                Iniciar Sesión
                            </Link>
                        </>
                    )}
                </section>
            </div>
        </nav>
    );
}

export default Navbar;
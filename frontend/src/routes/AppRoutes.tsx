import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import Navbar from '../components/navbar';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import NewProject from '../pages/NewProject';
//import Login from '../pages/Login';

// Lazy loading de páginas



export default function AppRoutes() {
    const location = useLocation();

    // Rutas donde NO se muestra el navbar
    const hideNavbarRoutes = ['/login'];
    const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

    return (
        <>
            {shouldShowNavbar && <Navbar />}
            
                <Routes>

                    {/* Rutas públicas */}
                    <Route path="/" element={<LandingPage />} />
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login/>
                            </PublicRoute>
                        }
                    />

                    {/* Rutas protegidas */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>

                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/new-project"
                        element={
                            <ProtectedRoute>
                                <NewProject />
                            </ProtectedRoute>
                        }
                    />

                    {/* 404 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            
        </>
    );
}

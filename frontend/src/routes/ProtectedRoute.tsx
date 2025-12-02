import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
}

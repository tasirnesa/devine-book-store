import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Loader from './Loader';

const ProtectedRoute = ({ adminOnly = false }) => {
    const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader />
                    <p className="text-sm font-bold text-bam-navy animate-pulse uppercase tracking-widest">Verifying Identity...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user?.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

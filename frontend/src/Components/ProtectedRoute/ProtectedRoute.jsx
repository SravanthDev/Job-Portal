import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

// Protected Route - Checks authentication and role before allowing access
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user, loading } = useAuth();

    // Debug logging to help diagnose issues
    console.log('[ProtectedRoute] State:', {
        isAuthenticated,
        loading,
        requiredRole,
        userRole: user?.role,
        userId: user?.id,
        userName: user?.name,
        hasUser: !!user
    });

    if (loading) {
        console.log('[ProtectedRoute] Still loading auth state...');
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh'
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.log('[ProtectedRoute] Not authenticated, redirecting to /login');
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        console.log('[ProtectedRoute] Role mismatch:', {
            required: requiredRole,
            actual: user?.role,
            redirecting: true
        });
        return <Navigate to="/" replace />;
    }

    console.log('[ProtectedRoute] Access granted, rendering protected content');
    return children;
};

export default ProtectedRoute;

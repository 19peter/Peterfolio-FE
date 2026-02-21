import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAdmin } = useAuth();

    if (!isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;

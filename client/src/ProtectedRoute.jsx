import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;  // Redirect to login if not authenticated
    }

    return children;  // Render children if authenticated
};

export default ProtectedRoute;

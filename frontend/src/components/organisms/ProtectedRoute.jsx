import React from 'react';
import { Navigate } from 'react-router-dom';
import api from 'utils/api';

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');
    const [userRole, setUserRole] = React.useState(null);

    React.useEffect(() => {
        if (token) {
            api.get('/user')
                .then((response) => setUserRole(response.data.role)) // Assuming the backend returns the user's role
                .catch(() => setUserRole(null));
        }
    }, [token]);

    if (!token) return <Navigate to="/login" />;
    if (userRole && userRole !== role) return <Navigate to="/unauthorized" />;

    return children;
};

export default ProtectedRoute;
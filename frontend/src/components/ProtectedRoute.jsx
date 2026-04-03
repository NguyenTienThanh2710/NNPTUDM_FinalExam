import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdminUser } from '../utils/auth';

const ProtectedRoute = ({ requireAdmin, children }) => {
    if (requireAdmin && !isAdminUser()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRoute;

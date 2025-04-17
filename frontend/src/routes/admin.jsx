import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/admin/Dashboard';
// import ManageUsers from '@/pages/admin/ManageUsers';

const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role === 'admin';
};

const adminRoutes = [
    <Route
        key="admin-dashboard"
        path="/admin/dashboard"
        element={isAdmin() ? <Dashboard /> : <Navigate to="/" />}
    />,
    <Route
        key="admin-manage-users"
        path="/admin/manage-users"
        element={isAdmin() ? <ManageUsers /> : <Navigate to="/" />}
    />,
];

export default adminRoutes;
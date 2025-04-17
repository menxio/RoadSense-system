import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Users = lazy(() => import('@/pages/admin/Users'));

const adminRoutes = [
    <Route
        key="admin-dashboard"
        path="/admin/dashboard"
        element={
            <React.Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
            </React.Suspense>
        }
    />,
    <Route
        key="admin-manage-users"
        path="/admin/manage-users"
        element={
            <React.Suspense fallback={<div>Loading...</div>}>
                <Users />
            </React.Suspense>
        }
    />,
];

export default adminRoutes;
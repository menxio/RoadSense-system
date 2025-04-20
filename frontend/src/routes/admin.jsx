import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Users = lazy(() => import('@/pages/admin/Users'));
const Vehicles = lazy(() => import('@/pages/admin/Vehicles/Vehicles'));
const Violations = lazy(() => import('@/pages/admin/Violations/Violations'));

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
    <Route
        key="admin-manage-vehicles"
        path="/admin/vehicles"
        element={
            <React.Suspense fallback={<div>Loading...</div>}>
                <Vehicles />
            </React.Suspense>
        }
    />,
    <Route
        key="admin-manage-violations"
        path="/admin/violations"
        element={
            <React.Suspense fallback={<div>Loading...</div>}>
                <Violations />
            </React.Suspense>
        }
    />,
];

export default adminRoutes;
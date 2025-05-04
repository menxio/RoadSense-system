import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
// import Profile from '@/pages/user/Profile';

const Dashboard = lazy(() => import('@/pages/user/Dashboard'));
const Violations = lazy(() => import('@/pages/user/Violations/Violations'));
const Help = lazy(() => import('@/pages/user/Help'));

const userRoutes = [
    <Route key="user-dashboard" path="/user/dashboard" element={<Dashboard />} />,
    // <Route key="user-profile" path="/profile" element={<Profile />} />,
    <Route key="user-violations" path="/user/violations" element={<Violations />} />,
    <Route key="user-help" path="/user/help" element={<Help />} />,
];

export default userRoutes;
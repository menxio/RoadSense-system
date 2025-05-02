import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
// import Profile from '@/pages/user/Profile';

const Dashboard = lazy(() => import('@/pages/user/Dashboard'));
const Violations = lazy(() => import('@/pages/user/Violations/Violations'));

const userRoutes = [
    <Route key="student-dashboard" path="/user/dashboard" element={<Dashboard />} />,
    // <Route key="user-profile" path="/profile" element={<Profile />} />,
    <Route key="user-violations" path="/user/violations" element={<Violations />} />,
];

export default userRoutes;
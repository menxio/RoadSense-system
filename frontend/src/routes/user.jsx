import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
// import Profile from '@/pages/user/Profile';

const Dashboard = lazy(() => import('@/pages/user/Dashboard'));

const userRoutes = [
    <Route key="student-dashboard" path="/user/dashboard" element={<Dashboard />} />,
    // <Route key="user-profile" path="/profile" element={<Profile />} />,
];

export default userRoutes;
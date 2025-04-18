import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
// import Profile from '@/pages/user/Profile';

const Dashboard = lazy(() => import('@/pages/student/Dashboard'));

const userRoutes = [
    <Route key="student-dashboard" path="/student/dashboard" element={<Dashboard />} />,
    // <Route key="user-profile" path="/profile" element={<Profile />} />,
];

export default userRoutes;
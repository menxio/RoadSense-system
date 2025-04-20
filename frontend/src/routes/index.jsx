import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from '@/pages/Landing';
import adminRoutes from './admin';
import userRoutes from './user';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

const AppRoutes = () => {
    return (
        <Routes>

            <Route path="/" element={<Landing />} />

            {/* Unauthenticated Routes */}
            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}

            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            {adminRoutes}

            {/* User Routes */}
            {userRoutes}

            {/* Catch-All Route */}
            {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    );
};

export default AppRoutes;
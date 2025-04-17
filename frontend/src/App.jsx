import React, { useEffect, useState } from 'react';
import api from './utils/api';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentDashboard from './pages/StudentDashboard';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/user/dashboard" element={<StudentDashboard />} />
                {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
            </Routes>
        </Router>
    );
};

export default App;
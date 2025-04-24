import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import adminRoutes from "./admin";
import userRoutes from "./user";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProtectedRoute from "@/routes/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute />}>{adminRoutes}</Route>

      {/* User Routes */}
      <Route element={<ProtectedRoute />}>{userRoutes}</Route>

      {/* Catch-All Route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;

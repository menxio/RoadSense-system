import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { fetchUserProfile } from "@/redux/slices/userSlice";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile())
        .unwrap()
        .catch((err) => {
          console.error("Error fetching profile:", err);
        });
    }
  }, [dispatch, token]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

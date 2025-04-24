import React from "react";
import { Box, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "@/redux/slices/userSlice";
import api from "@/utils/api";
import Navbar from "@/components/organisms/Navbar";
import LoginForm from "@/components/molecules/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await api.post("/login", { email, password });

      // Save token and role to localStorage
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      // Fetch user profile after login
      dispatch(fetchUserProfile());

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "user") {
        navigate("/user/dashboard");
      } else {
        alert("Unknown user role. Please contact support.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: "url(/img/main-entrance.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 3 }}>
        <Navbar />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 3,
          zIndex: 2,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#0d1b2a",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CardContent>
            <LoginForm onSubmit={handleLogin} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;

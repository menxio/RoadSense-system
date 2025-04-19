import React from 'react';
import { Box, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // ✅ Add this
import Navbar from '@/components/organisms/Navbar';
import LoginForm from '@/components/molecules/LoginForm';
import api from 'utils/api';


const Login = () => {
    const navigate = useNavigate();

    const handleLogin = async ({ email, password }) => {
        try {
            const response = await api.post('/login', {
                email,
                password,
            });
    
            // Save token and role to localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.user.role);
    
            // Redirect based on role
            const userRole = response.data.user.role;
            if (userRole === 'admin') {
                navigate('/admin/dashboard'); // Redirect to admin dashboard
            } else {
                navigate('/student/dashboard'); // Redirect to user dashboard
            }
        } catch (error) {
            console.error('Login failed:', error);
    
            // Display a more specific error message
            if (error.response && error.response.status === 401) {
                alert('Invalid email or password');
            } else {
                alert('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: '100vh',
                backgroundImage: 'url(/img/main-entrance.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Navbar */}
            <Box
                sx={{
                    position: 'relative', // Ensure Navbar is positioned relative to the parent
                    zIndex: 3, // Higher zIndex than the overlay
                }}
            >
                <Navbar />
            </Box>

            {/* Overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1, // Lower zIndex than the Navbar
                }}
            />

            {/* Login Form Section */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 3,
                    zIndex: 2, // Ensure content appears above the overlay
                }}
            >
                <Card
                    sx={{
                        width: '100%',
                        maxWidth: '400px',
                        backgroundColor: '#0d1b2a',
                        color: '#000',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
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
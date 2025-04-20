import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import api from 'utils/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const response = await api.post('/register', {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
            });

            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Box
                component="form"
                onSubmit={handleRegister}
                sx={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: 3,
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    borderRadius: 2,
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    Register
                </Typography>
                <TextField
                    label="Name"
                    name="name"
                    fullWidth
                    required
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    required
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    required
                    sx={{ marginBottom: 2 }}
                />
                <Button type="submit" variant="contained" fullWidth>
                    Register
                </Button>
            </Box>
        </Box>
    );
};

export default Register;
import React from 'react';
import LoginForm from '@/components/molecules/LoginForm';
import api from 'utils/api';

const Login = ({ onLogin }) => {
    const handleLogin = async ({ email, password }) => {
        try {
            const response = await api.post('/login', {
                email,
                password,
            });

            // Save token to localStorage
            localStorage.setItem('token', response.data.token);

            // Pass user data to parent component
            onLogin(response.data.user);

            alert('Login successful!');
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Invalid email or password');
        }
    };

    return <LoginForm onSubmit={handleLogin} />;
};

export default Login;
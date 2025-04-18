import React, { useState } from 'react';
import { Box, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/organisms/Navbar';
import RegisterForm from '@/components/molecules/RegisterForm';
import api from 'utils/api';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async ({ username, email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      const response = await api.post('/register', {
        name: username,
        email,
        password,
      });

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).join(', '));
      } else {
        setError(err.response?.data?.message || 'An error occurred during registration');
      }
    } finally {
      setLoading(false);
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
          position: 'relative',
          zIndex: 3,
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
          zIndex: 1,
        }}
      />

      {/* Register Form Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 3,
          zIndex: 2,
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: '#0d1b2a',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          <CardContent>
            <RegisterForm
              onSubmit={handleRegister}
              loading={loading}
              error={error}
              success={success}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Register;
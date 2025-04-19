import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '@/components/molecules/RegisterForm';
import api from 'utils/api';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const response = await api.post('/register', {
        name: values.username,
        email: values.email,
        plate_number: values.plate_number,
        password: values.password,
      });

      alert('Registration successful! Redirecting to login...');
      resetForm();
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors({ apiError: Object.values(err.response.data.errors).join(', ') });
      } else {
        setErrors({ apiError: err.response?.data?.message || 'An error occurred during registration' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0d1b2a',
      }}
    >
      <RegisterForm onSubmit={handleRegister} />
    </Box>
  );
};

export default Register;
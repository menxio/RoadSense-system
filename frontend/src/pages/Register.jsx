import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '@/components/molecules/RegisterForm';
import api from 'utils/api';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      // Prepare form data for submission
      const formData = new FormData();
      formData.append('name', values.username);
      formData.append('email', values.email);
      formData.append('plate_number', values.plate_number);
      formData.append('password', values.password);
      formData.append('school_id', values.school_id);
      formData.append('license_id_image', values.license_id_image);

      // Send the form data to the backend
      const response = await api.post('/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
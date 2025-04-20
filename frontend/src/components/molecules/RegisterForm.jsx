import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const RegisterForm = ({ onSubmit, loading }) => {
  // Yup validation schema
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    plate_number: Yup.string()
      .required('Plate number is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        plate_number: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', color: '#fff' }}>
              Register
            </Typography>

            <Field
              as={TextField}
              name="username"
              label="Name"
              fullWidth
              margin="normal"
              error={touched.username && Boolean(errors.username)}
              helperText={touched.username && errors.username}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#fff' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#6C63FF' },
                  '&:hover fieldset': { borderColor: '#5a52d6' },
                },
              }}
            />

            <Field
              as={TextField}
              name="email"
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#fff' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#6C63FF' },
                  '&:hover fieldset': { borderColor: '#5a52d6' },
                },
              }}
            />

            <Field
              as={TextField}
              name="plate_number"
              label="Plate Number"
              fullWidth
              margin="normal"
              error={touched.plate_number && Boolean(errors.plate_number)}
              helperText={touched.plate_number && errors.plate_number}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#fff' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#6C63FF' },
                  '&:hover fieldset': { borderColor: '#5a52d6' },
                },
              }}
            />

            <Field
              as={TextField}
              name="password"
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#fff' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#6C63FF' },
                  '&:hover fieldset': { borderColor: '#5a52d6' },
                },
              }}
            />

            <Field
              as={TextField}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#fff' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#6C63FF' },
                  '&:hover fieldset': { borderColor: '#5a52d6' },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting || loading}
              sx={{
                backgroundColor: '#6C63FF',
                color: '#fff',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#5a52d6' },
              }}
            >
              {isSubmitting || loading ? 'Registering...' : 'Register'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
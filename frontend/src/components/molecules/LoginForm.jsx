import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const LoginForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
            }}
        >
            <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', color: '#fff' }}>
                Login
            </Typography>
            <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ style: { color: '#ccc' } }}
                InputProps={{
                    style: { color: '#fff' },
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#6C63FF' },
                        '&:hover fieldset': { borderColor: '#5a52d6' },
                    },
                }}
            />
            <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ style: { color: '#ccc' } }}
                InputProps={{
                    style: { color: '#fff' },
                }}
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
                sx={{
                    backgroundColor: '#6C63FF',
                    color: '#fff',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: '#5a52d6' },
                }}
            >
                Login
            </Button>
        </Box>
    );
};

export default LoginForm;
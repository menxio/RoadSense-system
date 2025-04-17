import React from 'react';
import { Typography } from '@mui/material';

const FormError = ({ message }) => {
    if (!message) return null;

    return (
        <Typography color="error" mb={2}>
            {message}
        </Typography>
    );
};

export default FormError;
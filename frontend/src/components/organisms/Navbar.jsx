import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Navbar = () => {
    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: '#0d1b2a',
                boxShadow: 'none',
                padding: '10px 20px',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <img
                            src="/img/logo.png" // Replace with the correct logo path
                            alt="RoadSense Logo"
                            style={{ height: '40px', marginRight: '10px' }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 'bold',
                                color: '#fff',
                            }}
                        >
                            RoadSense
                        </Typography>
                    </Link>
                </Box>

                {/* Navigation Links */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button color="inherit" sx={{ color: '#fff', marginRight: 2 }}>
                        About Us
                    </Button>
                    <Button color="inherit" sx={{ color: '#fff', marginRight: 2 }}>
                        Services
                    </Button>
                    <Button color="inherit" sx={{ color: '#fff', marginRight: 2 }} href="/login">
                        Login
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#6C63FF',
                            color: '#fff',
                            '&:hover': { backgroundColor: '#5a52d6' },
                        }}
                        href="/register"
                    >
                        Sign Up
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Landing = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: 'url(/images/main-entrance.png)', // Replace with your image path
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Navigation Bar */}
            <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
                        RoadSense
                    </Typography>
                    <Box>
                        <Button color="inherit" sx={{ color: '#fff', marginRight: 2 }}>
                            About Us
                        </Button>
                        <Button color="inherit" sx={{ color: '#fff', marginRight: 2 }}>
                            Services
                        </Button>
                        <Button color="inherit" sx={{ color: '#fff', marginRight: 2 }}>
                            Login
                        </Button>
                        <Button variant="contained" sx={{ backgroundColor: '#6C63FF' }}>
                            Sign Up
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: '#fff',
                    padding: 3,
                }}
            >
                <Typography variant="h2" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    Road<span style={{ color: '#FF0000' }}>Sense</span>
                </Typography>
                <Typography variant="h6" sx={{ marginBottom: 4 }}>
                    Monitor, Detect and Respond to Traffic Violations in Real Time
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#FF0000',
                        padding: '10px 20px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                    }}
                >
                    Get Started
                </Button>
            </Box>
        </Box>
    );
};

export default Landing;
import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';

const Dashboard = () => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Sidebar */}
            <Box
                sx={{
                    width: '250px',
                    backgroundColor: '#1a202c',
                    color: '#fff',
                    padding: 2,
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
                    RoadSense
                </Typography>
                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        Violation Types
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        Live Cam
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ marginTop: 3, color: '#aaa' }}>
                    MAINTENANCE
                </Typography>
                <Box sx={{ marginTop: 1 }}>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        Manage Violations
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        Manage Users
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        Reports
                    </Typography>
                </Box>
                <Typography variant="body1" sx={{ marginTop: 3, color: '#aaa' }}>
                    Logout
                </Typography>
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, padding: 3 }}>
                {/* Welcome Message */}
                <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
                    Welcome Angel Admin!
                </Typography>

                {/* Statistics Cards */}
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Today's Violations</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', marginY: 2 }}>
                                    0
                                </Typography>
                                <Button variant="text">VIEW</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Total Driver's Listed</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', marginY: 2 }}>
                                    0
                                </Typography>
                                <Button variant="text">VIEW</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Total Traffic Violations</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', marginY: 2 }}>
                                    0
                                </Typography>
                                <Button variant="text">VIEW</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Charts Section */}
                <Grid container spacing={3} sx={{ marginTop: 3 }}>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Violation Distribution</Typography>
                                {/* Add your chart or placeholder here */}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Monthly Violations</Typography>
                                {/* Add your chart or placeholder here */}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Dashboard;
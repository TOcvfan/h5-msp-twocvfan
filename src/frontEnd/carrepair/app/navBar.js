'use client';

import React from 'react';
import { Box } from '@mui/material';
import AppNavBar from './nav/appBar';

const Navigation = ({ navn }) => {
    const pages = [
        { name: 'Login', link: '/login' },
        { name: 'Register', link: '/register' },
        { name: 'Om os', link: '/about' },
    ];

    return (
        <Box sx={{ width: '100%', zIndex: 1000 }}>
            <AppNavBar navn={navn} sider={pages} />
        </Box>
    );
};

export default Navigation;
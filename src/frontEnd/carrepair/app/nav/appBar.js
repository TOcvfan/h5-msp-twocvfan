'use client';

import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Container,
    Menu,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItems from './MenyTing';
import LogIndUd from './logIndUdKnap';

const AppNavBar = ({ navn, sider }) => {
    const [anchorElNav, setAnchorElNav] = useState(null);

    const open = Boolean(anchorElNav);

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: 'secondary.main',
                color: 'primary.main',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>

                    {/* LOGO / NAVN */}
                    <Typography
                        variant="h6"
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            fontWeight: 700,
                            textDecoration: 'none',
                            color: 'primary.main',
                        }}
                    >
                        {navn}
                    </Typography>

                    {/* MOBIL MENU */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
                        <IconButton onClick={(e) => setAnchorElNav(e.currentTarget)}>
                            <MenuIcon />
                        </IconButton>

                        <Menu
                            anchorEl={anchorElNav}
                            open={open}
                            onClose={() => setAnchorElNav(null)}
                        >
                            <MenuItems
                                sider={sider}
                                handleCloseNavMenu={() => setAnchorElNav(null)}
                                isMobile={true}
                            />
                        </Menu>
                    </Box>

                    {/* DESKTOP MENU */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 'auto' }}>
                        <MenuItems
                            sider={sider}
                            handleCloseNavMenu={() => setAnchorElNav(null)}
                            isMobile={false}
                        />
                    </Box>

                    {/* LOGIN / AVATAR */}
                    <LogIndUd />
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default AppNavBar;
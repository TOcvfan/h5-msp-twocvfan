'use client';

import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Avatar,
    Tooltip,
    Menu,
    MenuItem,
    Typography
} from '@mui/material';
import { useAppContext } from '$/AppContext';
import Image from 'next/image';
import Logud from '$/logUd';

const LogIndUd = () => {
    const { isLoggedIn } = useAppContext();
    const [anchorEl, setAnchorEl] = useState(null);
    const [logUdModal, setLogUdModal] = useState(false);

    const open = Boolean(anchorEl);

    return (
        <Box>
            <Tooltip title={isLoggedIn ? "Konto" : "Log ind"}>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <Avatar
                        src="/logomini.png"
                        alt="logo"
                        sx={{ width: 40, height: 40, bgcolor: "#3b82f6" }}
                    />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
            >
                {!isLoggedIn && (
                    <MenuItem component="a" href="/login">
                        Log ind
                    </MenuItem>
                )}

                {isLoggedIn && (
                    <>
                        <MenuItem component="a" href="/skrivebord">
                            Dashboard
                        </MenuItem>

                        <MenuItem onClick={() => setLogUdModal(true)}>
                            <Typography color="error">
                                Log ud
                            </Typography>
                        </MenuItem>
                    </>
                )}
            </Menu>

            {isLoggedIn && (
                <Logud
                    handleModal={() => setLogUdModal(false)}
                    modal={logUdModal}
                />
            )}
        </Box>
    );
};

export default LogIndUd;
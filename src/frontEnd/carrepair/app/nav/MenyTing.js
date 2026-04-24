'use client';

import React from 'react';
import { Box, Button, MenuItem } from '@mui/material';
import { usePathname } from 'next/navigation';
import { GrTestDesktop } from 'react-icons/gr';
import { useAppContext } from '$/AppContext';

const MenuItems = ({ sider, handleCloseNavMenu, isMobile }) => {
    const pathname = usePathname();
    const { isLoggedIn } = useAppContext();

    const isActive = (path) => pathname === path;

    const commonStyle = (active) => ({
        borderRadius: 2,
        fontWeight: active ? 'bold' : 'normal',
        backgroundColor: active ? 'rgba(59,130,246,0.15)' : 'transparent',
        color: 'white',
        '&:hover': {
            backgroundColor: 'rgba(59,130,246,0.25)',
        }
    });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 0 : 2,
            }}
        >
            {sider.map((p) => {
                const active = isActive(p.link);

                if (isMobile) {
                    return (
                        <MenuItem
                            key={p.name}
                            onClick={handleCloseNavMenu}
                            sx={commonStyle(active)}
                            component="a"
                            href={p.link}
                        >
                            {p.name}
                        </MenuItem>
                    );
                }

                return (
                    <Button
                        key={p.name}
                        onClick={handleCloseNavMenu}
                        href={p.link}
                        sx={commonStyle(active)}
                    >
                        {p.name}
                    </Button>
                );
            })}

            {isLoggedIn && (
                isMobile ? (
                    <MenuItem
                        onClick={handleCloseNavMenu}
                        sx={commonStyle(isActive('/skrivebord'))}
                        component="a"
                        href="/skrivebord"
                    >
                        <GrTestDesktop />
                    </MenuItem>
                ) : (
                    <Button
                        href="/skrivebord"
                        sx={commonStyle(isActive('/skrivebord'))}
                    >
                        <GrTestDesktop />
                    </Button>
                )
            )}
        </Box>
    );
};

export default MenuItems;
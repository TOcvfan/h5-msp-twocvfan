'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3b82f6', // blå
        },
        secondary: {
            main: '#1e293b', // mørk
        },
        background: {
            default: '#f8fafc',
        },
        text: {
            primary: '#0f172a',
        },
    },
});

export default theme;
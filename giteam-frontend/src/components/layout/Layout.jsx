// components/layout/Layout.js
import React, { useState, useEffect, createContext } from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import { getUserInfo } from '../../services/auth';

// Contexto para alternar o tema dark/light
export const ThemeContext = createContext({
  toggleColorMode: () => {},
});

const Layout = ({ children, title }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isDarkMode = theme.palette.mode === 'dark';
    const [drawerOpen, setDrawerOpen] = useState(!isMobile);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserInfo();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        // Fecha o drawer se for mobile
        if (isMobile) {
            setDrawerOpen(false);
        }
    }, [isMobile]);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const bgColor = isDarkMode ? '#0d1117' : '#f6f8fa';

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: bgColor,
            }}
        >
            {/* Sidebar */}
            <Sidebar drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />

            {/* Main content */}
            <Box sx={{ flexGrow: 1 }}>
                <Header title={title} toggleDrawer={toggleDrawer} user={user} />
                <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
                    {children}
                </Container>
            </Box>
        </Box>
    );
};

export default Layout;
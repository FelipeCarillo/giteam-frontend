import React, { useState } from 'react';
import {
    Box,
    Typography,
    useTheme,
    useMediaQuery,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    AppBar,
    Toolbar,
    Button,
    Divider,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import FolderIcon from '@mui/icons-material/Folder';
import HistoryIcon from '@mui/icons-material/History';
import PaidIcon from '@mui/icons-material/Paid';
import { logout } from '../services/auth';

/**
 * MainLayout component that provides a consistent layout structure for all pages
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to render in the main content area
 * @param {string} props.title - Page title to display in the app bar
 */
function MainLayout({ children, title }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isDarkMode = theme.palette.mode === 'dark';
    const [drawerOpen, setDrawerOpen] = useState(!isMobile);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const primaryColor = theme.palette.primary.main;
    const bgColor = isDarkMode ? '#0d1117' : '#f6f8fa';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';

    const drawerWidth = 240;

    // Navigation menu items
    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'My Agents', icon: <SmartToyOutlinedIcon />, path: '/agents' },
        { text: 'Repositories', icon: <FolderIcon />, path: '/repositories' },
        { text: 'Operation History', icon: <HistoryIcon />, path: '/history' },
        { text: 'Costs', icon: <PaidIcon />, path: '/costs' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    ];

    // Determine active menu item based on current path
    const getCurrentPath = () => {
        if (typeof window !== 'undefined') {
            return window.location.pathname;
        }
        return '/';
    };

    const currentPath = getCurrentPath();

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: bgColor,
            }}
        >
            {/* Sidebar */}
            <Drawer
                variant={isMobile ? 'temporary' : 'persistent'}
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: isDarkMode ? '#161b22' : '#fff',
                        borderRight: `1px solid ${borderColor}`,
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SmartToyOutlinedIcon
                            sx={{
                                fontSize: 24,
                                mr: 1,
                                color: primaryColor
                            }}
                        />
                        <Typography variant="h6" fontWeight="bold" sx={{ color: primaryTextColor }}>
                            GiTeams
                        </Typography>
                    </Box>
                    {isMobile && (
                        <IconButton onClick={toggleDrawer}>
                            <ChevronRightIcon />
                        </IconButton>
                    )}
                </Box>
                <Divider sx={{ borderColor }} />
                <List>
                    {menuItems.map((item, index) => {
                        const isActive = currentPath === item.path ||
                            (item.path !== '/' && currentPath.startsWith(item.path));

                        return (
                            <ListItem
                                button
                                key={item.text}
                                component="a"
                                href={item.path}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive ? primaryColor : secondaryTextColor, minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        color: isActive ? primaryTextColor : secondaryTextColor,
                                        fontWeight: isActive ? 500 : 400
                                    }}
                                />
                            </ListItem>
                        );
                    })}
                </List>
                <Divider sx={{ borderColor }} />
                <Box sx={{ mt: 'auto', p: 2 }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={logout}
                        startIcon={<LogoutIcon />}
                        sx={{
                            borderColor: borderColor,
                            color: secondaryTextColor,
                            '&:hover': {
                                borderColor: primaryColor,
                                backgroundColor: isDarkMode ? 'rgba(46, 164, 79, 0.1)' : 'rgba(46, 164, 79, 0.05)',
                            },
                            textTransform: 'none',
                        }}
                    >
                        Sign out
                    </Button>
                </Box>
            </Drawer>

            {/* Main content */}
            <Box sx={{ flexGrow: 1 }}>
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        backgroundColor: paperBgColor,
                        borderBottom: `1px solid ${borderColor}`,
                        color: primaryTextColor,
                    }}
                >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer}
                            sx={{ mr: 2, display: isMobile ? 'block' : 'none' }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
                            {title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <GitHubIcon sx={{ mr: 1, color: secondaryTextColor }} />
                            <Typography variant="body2" color={secondaryTextColor}>
                                FelipeCarillo
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Page content */}
                {children}
            </Box>
        </Box>
    );
}

export default MainLayout;
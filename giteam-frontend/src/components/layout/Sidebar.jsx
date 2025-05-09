// components/layout/Sidebar.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Button,
    IconButton,
    Typography,
    useTheme,
    useMediaQuery
} from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import FolderIcon from '@mui/icons-material/Folder';
import PaidIcon from '@mui/icons-material/Paid';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { logout } from '../../services/auth';
import { useLanguage } from '../../contexts/LanguageContext';

const Sidebar = ({ drawerOpen, toggleDrawer }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isDarkMode = theme.palette.mode === 'dark';
    const { t } = useLanguage();
    
    const primaryColor = theme.palette.primary.main;
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const drawerWidth = 240;

    const menuItems = [
        { text: t('dashboard'), icon: <DashboardIcon />, path: '/dashboard' },
        { text: t('myAgents'), icon: <SmartToyOutlinedIcon />, path: '/agents' },
        { text: t('repositories'), icon: <FolderIcon />, path: '/repositories' },
        { text: t('operationHistory'), icon: <HistoryIcon />, path: '/operations' },
        { text: t('costs'), icon: <PaidIcon />, path: '/costs' },
        { text: t('settings'), icon: <SettingsIcon />, path: '/settings' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) {
            toggleDrawer();
        }
    };

    return (
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
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || 
                                    (item.path !== '/' && location.pathname.startsWith(item.path));
                    
                    return (
                        <ListItem 
                            button 
                            key={item.text} 
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
                                }
                            }}
                        >
                            <ListItemIcon 
                                sx={{ 
                                    color: isActive ? primaryColor : secondaryTextColor, 
                                    minWidth: 40 
                                }}
                            >
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
                    onClick={() => logout}
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
                    {t('signOut')}
                </Button>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
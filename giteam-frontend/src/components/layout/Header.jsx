// components/layout/Header.jsx
import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    useTheme,
    useMediaQuery,
    Divider,
    Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeContext } from './Layout';
import LanguageSwitcher from './LanguageSwitcher';

const Header = ({ title, toggleDrawer, user }) => {
    const theme = useTheme();
    const colorMode = React.useContext(ThemeContext);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isDarkMode = theme.palette.mode === 'dark';
    
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';

    console.log('Header user:', user); // Debugging line

    return (
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
                    <LanguageSwitcher />
                    
                    <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, my: 'auto' }} />
                    
                    <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{ mx: 1 }}>
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                    
                    <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, my: 'auto' }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                        <Typography variant="body2" color={secondaryTextColor}>
                            {user ? user.name : 'Loading...'}
                        </Typography>
                        {user && (                        
                            <Avatar alt="Avatar" sizes='10' sx={{ml: 1}} src={user?.avatar_url} />
                        )}
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
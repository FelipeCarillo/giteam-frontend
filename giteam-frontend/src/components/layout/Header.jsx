// components/layout/Header.jsx
import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    useTheme,
    useMediaQuery,
    Divider,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    ButtonBase
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LanguageIcon from '@mui/icons-material/Language';
import { ThemeContext } from './Layout';
import LanguageSwitcher from './LanguageSwitcher';

const Header = ({ title, toggleDrawer, user }) => {
    const theme = useTheme();
    const colorMode = React.useContext(ThemeContext);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isDarkMode = theme.palette.mode === 'dark';
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentLanguage, setCurrentLanguage] = useState('pt'); // Estado para idioma
    const open = Boolean(anchorEl);
    
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleThemeToggle = () => {
        colorMode.toggleColorMode();
        handleClose();
    };

    const handleLanguageToggle = () => {
        // Alterna entre português e inglês (ou outros idiomas conforme necessário)
        const newLanguage = currentLanguage === 'pt' ? 'en' : 'pt';
        setCurrentLanguage(newLanguage);
        // Aqui você pode adicionar a lógica para trocar o idioma da aplicação
        handleClose();
    };

    const getLanguageText = () => {
        return currentLanguage === 'pt' ? 'Português' : 'English';
    };

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
                    <ButtonBase
                        onClick={handleClick}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1,
                            borderRadius: 1,
                            '&:hover': {
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                            },
                        }}
                    >
                        <Typography variant="body2" color={secondaryTextColor} sx={{ mr: 1 }}>
                            {user ? user.name : 'Loading...'}
                        </Typography>
                        {user && (
                            <Avatar alt="Avatar" sizes='small' sx={{ width: 32, height: 32 }} src={user?.avatar_url} />
                        )}
                    </ButtonBase>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            sx: {
                                backgroundColor: paperBgColor,
                                border: `1px solid ${borderColor}`,
                                mt: 1.5,
                                minWidth: 200,
                                '& .MuiMenuItem-root': {
                                    color: primaryTextColor,
                                    '&:hover': {
                                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                                    },
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={handleLanguageToggle}>
                            <ListItemIcon>
                                <LanguageIcon fontSize="small" sx={{ color: primaryTextColor }} />
                            </ListItemIcon>
                            <ListItemText primary="Idioma" />
                            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                    {getLanguageText()}
                                </Typography>
                            </Box>
                        </MenuItem>
                        
                        <Divider sx={{ borderColor: borderColor }} />
                        
                        <MenuItem onClick={handleThemeToggle}>
                            <ListItemIcon>
                                {theme.palette.mode === 'dark' ? 
                                    <Brightness7Icon fontSize="small" sx={{ color: primaryTextColor }} /> : 
                                    <Brightness4Icon fontSize="small" sx={{ color: primaryTextColor }} />
                                }
                            </ListItemIcon>
                            <ListItemText primary="Tema" />
                            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                    {theme.palette.mode === 'dark' ? 'Escuro' : 'Claro'}
                                </Typography>
                            </Box>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
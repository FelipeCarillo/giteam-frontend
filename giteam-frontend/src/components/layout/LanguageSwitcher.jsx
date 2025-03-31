// components/layout/LanguageSwitcher.jsx
import React from 'react';
import { 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  ListItemText, 
  ListItemIcon 
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    handleClose();
  };

  const languages = [
    { code: 'pt-BR', name: 'Português (BR)' },
    { code: 'en-US', name: 'English (US)' }
  ];

  return (
    <Box>
      <Button
        color="inherit"
        startIcon={<LanguageIcon />}
        onClick={handleClick}
        size="small"
      >
        {language === 'pt-BR' ? 'PT' : 'EN'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={language === lang.code}
          >
            <ListItemIcon sx={{ minWidth: 35 }}>
              {language === lang.code && <CheckIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>{lang.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
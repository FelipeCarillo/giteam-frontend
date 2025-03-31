// components/dashboard/StatCard.js
import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';

const StatCard = ({ icon, title, value, subtitle }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    
    const primaryColor = theme.palette.primary.main;
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                backgroundColor: paperBgColor,
                border: `1px solid ${borderColor}`,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {React.cloneElement(icon, { sx: { mr: 1, color: primaryColor } })}
                <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                    {title}
                </Typography>
            </Box>
            <Typography variant="h3" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                {value}
            </Typography>
            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                {subtitle}
            </Typography>
        </Paper>
    );
};

export default StatCard;
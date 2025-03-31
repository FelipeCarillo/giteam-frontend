// components/dashboard/AgentCreationCard.js
import React from 'react';
import { Box, Card, Typography, Grid, Button, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const AgentCreationCard = ({ agentOptions, title, description }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const isDarkMode = theme.palette.mode === 'dark';

    const primaryColor = theme.palette.primary.main;
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const hoverBgColor = isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';

    const handleCreateAgent = (agentType) => {
        navigate('/agents/create', { state: { agentType } });
    };

    // Função para obter o ícone correspondente à função do agente
    const getIconComponent = (functionId) => {
        switch(functionId) {
            case 'PR Review':
                return 'code';
            case 'Issue Resolution':
                return 'bug_report';
            case 'Both':
                return 'smart_toy';
            default:
                return 'add';
        }
    };

    return (
        <Card
            elevation={0}
            sx={{
                mb: 4,
                backgroundColor: paperBgColor,
                border: `1px solid ${borderColor}`,
                borderRadius: 2,
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    p: 3,
                    borderBottom: `1px solid ${borderColor}`,
                    backgroundColor: isDarkMode ? 'rgba(46, 164, 79, 0.03)' : 'rgba(46, 164, 79, 0.02)'
                }}
            >
                <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                    {title || t('createNewAgent')}
                </Typography>
                <Typography variant="body2" sx={{ color: secondaryTextColor, mt: 0.5 }}>
                    {description || t('createAgentDesc')}
                </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    {agentOptions.map((option) => (
                        <Grid item xs={12} sm={4} key={option.id}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => handleCreateAgent(option.id)}
                                startIcon={
                                    <span className="material-symbols-outlined">
                                        {getIconComponent(option.id)}
                                    </span>
                                }
                                sx={{
                                    justifyContent: 'flex-start',
                                    textTransform: 'none',
                                    p: 2,
                                    color: primaryTextColor,
                                    borderColor: borderColor,
                                    borderRadius: 1,
                                    fontWeight: 500,
                                    backgroundColor: 'transparent',
                                    textAlign: 'left',
                                    '&:hover': {
                                        backgroundColor: hoverBgColor,
                                        borderColor: primaryColor,
                                    },
                                }}
                            >
                                {t(option.translationKey) || option.title}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Card>
    );
};

export default AgentCreationCard;
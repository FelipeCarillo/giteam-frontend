// components/agent/AgentItem.js
import React from 'react';
import {
    Box,
    Grid,
    Typography,
    Chip,
    Avatar,
    IconButton,
    useTheme,
    Tooltip
} from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { agentFunctions, availableModels, responseLengthOptions } from '../../services/mockData';
import { useLanguage } from '../../contexts/LanguageContext';

const AgentItem = ({ agent, repository, onToggleActive, onDelete }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const { t } = useLanguage();

    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';

    // ✅ Função para formatação segura de números
    const formatCurrency = (value) => {
        if (value === null || value === undefined || isNaN(value)) {
            return '0.00';
        }
        return Number(value).toFixed(2);
    };

    const formatNumber = (value) => {
        if (value === null || value === undefined || isNaN(value)) {
            return '0';
        }
        return Number(value).toLocaleString();
    };

    // ✅ Dados seguros do agente com valores padrão
    const safeAgent = {
        id: null,
        name: 'Unknown Agent',
        active: false,
        function: 'unknown',
        model: 'unknown',
        responseLength: 'medium',
        costMonth: 0,
        branches: [],
        ...agent // Override com os valores reais se existirem
    };

    // Encontrar detalhes do modelo
    const modelDetails = availableModels?.find(m => m.id === safeAgent.model) || {
        name: safeAgent.model,
        maxTokens: 4000
    };

    // Encontrar detalhes do comprimento de resposta
    const responseLengthDetails = responseLengthOptions?.find(r => r.id === safeAgent.responseLength) || {
        title: 'Médio',
        tokenPercentage: 0.6
    };

    // Calcular tokens utilizados com valores seguros
    const tokensUsed = modelDetails
        ? Math.round(modelDetails.maxTokens * (responseLengthDetails?.tokenPercentage || 0.6))
        : 0;

    // Função segura para obter título da função
    const getFunctionTitle = (functionKey) => {
        if (!agentFunctions || !functionKey) return functionKey || 'Unknown';
        return agentFunctions[functionKey]?.title || functionKey;
    };

    // Garantir que branches é sempre um array
    const safeBranches = Array.isArray(safeAgent.branches) ? safeAgent.branches : [];

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: safeAgent.active ?
                                    (isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)') :
                                    (isDarkMode ? 'rgba(215, 58, 73, 0.2)' : 'rgba(215, 58, 73, 0.1)'),
                                color: safeAgent.active ?
                                    (isDarkMode ? '#7ee787' : '#2ea44f') :
                                    (isDarkMode ? '#ff7b72' : '#d73a49'),
                                mr: 2
                            }}
                        >
                            <SmartToyOutlinedIcon />
                        </Avatar>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="subtitle1" fontWeight="500" sx={{ color: primaryTextColor, mr: 1 }}>
                                    {safeAgent.name}
                                </Typography>
                                <Chip
                                    label={safeAgent.active ? t('active') : t('inactive')}
                                    size="small"
                                    sx={{
                                        backgroundColor: safeAgent.active ?
                                            (isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)') :
                                            (isDarkMode ? 'rgba(215, 58, 73, 0.2)' : 'rgba(215, 58, 73, 0.1)'),
                                        color: safeAgent.active ?
                                            (isDarkMode ? '#7ee787' : '#2ea44f') :
                                            (isDarkMode ? '#ff7b72' : '#d73a49')
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ color: secondaryTextColor, mt: 0.5 }}>
                                {getFunctionTitle(safeAgent.function)} | {modelDetails?.name || safeAgent.model}
                            </Typography>
                            {repository && (
                                <Typography variant="body2" sx={{ color: secondaryTextColor, mt: 0.5 }}>
                                    {t('repositoryAgentItem')}: {repository}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    {(safeAgent.function === 'PR Review' || safeAgent.function === 'Both') && safeBranches.length > 0 && (
                        <Box>
                            <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                Branches monitoradas:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {safeBranches.map((branch, index) => (
                                    <Chip
                                        key={`${branch}-${index}`}
                                        label={branch}
                                        size="small"
                                        sx={{
                                            backgroundColor: isDarkMode ? 'rgba(56, 139, 253, 0.15)' : 'rgba(3, 102, 214, 0.1)',
                                            color: isDarkMode ? '#58a6ff' : '#0366d6',
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 0.5 }}>
                            {t('responseConfig')}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                                label={
                                    responseLengthDetails?.id === 'concise' ? t('concise') :
                                    responseLengthDetails?.id === 'medium' ? t('medium') :
                                    responseLengthDetails?.id === 'detailed' ? t('detailed') :
                                    t('medium') // fallback padrão
                                }
                                size="small"
                                sx={{
                                    backgroundColor: isDarkMode ? 'rgba(56, 139, 253, 0.15)' : 'rgba(3, 102, 214, 0.1)',
                                    color: isDarkMode ? '#58a6ff' : '#0366d6',
                                }}
                            />
                            <Tooltip title={`${formatNumber(tokensUsed)} ${t('tokenPerResponse')}`}>
                                <IconButton size="small">
                                    <InfoOutlinedIcon fontSize="small" sx={{ color: secondaryTextColor }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, height: '100%', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="body2" sx={{ color: secondaryTextColor, textAlign: 'right' }}>
                                {t('costThisMonth')}
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="500" sx={{ color: primaryTextColor, textAlign: 'right' }}>
                                ${formatCurrency(safeAgent.costMonth)}
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={() => onToggleActive && onToggleActive(safeAgent.id)}
                            sx={{
                                color: safeAgent.active ?
                                    (isDarkMode ? '#ff7b72' : '#d73a49') :
                                    (isDarkMode ? '#7ee787' : '#2ea44f'),
                                border: `1px solid ${borderColor}`,
                                marginLeft: 1
                            }}
                            title={safeAgent.active ? t('deactivateAgent') : t('activateAgent')}
                        >
                            <PowerSettingsNewIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => onDelete && onDelete(safeAgent.id)}
                            sx={{
                                color: isDarkMode ? '#ff7b72' : '#d73a49',
                                border: `1px solid ${borderColor}`
                            }}
                            title={t('deleteAgent')}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AgentItem;
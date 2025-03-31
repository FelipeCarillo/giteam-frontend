// components/agent/AgentItem.js
import React from 'react';
import {
    Box,
    Grid,
    Typography,
    Chip,
    Avatar,
    IconButton,
    LinearProgress,
    useTheme,
    Tooltip
} from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { agentFunctions, availableModels, responseLengthOptions } from '../../services/mockData';

const AgentItem = ({ agent, repository, onToggleActive, onDelete }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';

    // Encontrar detalhes do modelo
    const modelDetails = availableModels.find(m => m.id === agent.model);
    // Encontrar detalhes do comprimento de resposta
    const responseLengthDetails = responseLengthOptions.find(r => r.id === agent.responseLength);
    // Calcular tokens utilizados
    const tokensUsed = modelDetails
        ? Math.round(modelDetails.maxTokens * (responseLengthDetails?.tokenPercentage || 0.6))
        : 0;

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: agent.active ?
                                    (isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)') :
                                    (isDarkMode ? 'rgba(215, 58, 73, 0.2)' : 'rgba(215, 58, 73, 0.1)'),
                                color: agent.active ?
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
                                    {agent.name}
                                </Typography>
                                <Chip
                                    label={agent.active ? 'Ativo' : 'Inativo'}
                                    size="small"
                                    sx={{
                                        backgroundColor: agent.active ?
                                            (isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)') :
                                            (isDarkMode ? 'rgba(215, 58, 73, 0.2)' : 'rgba(215, 58, 73, 0.1)'),
                                        color: agent.active ?
                                            (isDarkMode ? '#7ee787' : '#2ea44f') :
                                            (isDarkMode ? '#ff7b72' : '#d73a49')
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ color: secondaryTextColor, mt: 0.5 }}>
                                {agentFunctions[agent.function]?.title || agent.function} | {modelDetails?.name || agent.model}
                            </Typography>
                            {repository && (
                                <Typography variant="body2" sx={{ color: secondaryTextColor, mt: 0.5 }}>
                                    Repositório: {repository}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    {(agent.function === 'PR Review' || agent.function === 'Both') && agent.branches && (
                        <Box>
                            <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                Branches monitoradas:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {agent.branches.map(branch => (
                                    <Chip
                                        key={branch}
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
                            Configuração da resposta:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                                label={responseLengthDetails?.title || 'Médio'}
                                size="small"
                                sx={{
                                    backgroundColor: isDarkMode ? 'rgba(56, 139, 253, 0.15)' : 'rgba(3, 102, 214, 0.1)',
                                    color: isDarkMode ? '#58a6ff' : '#0366d6',
                                }}
                            />
                            <Tooltip title={`${tokensUsed.toLocaleString()} tokens por resposta`}>
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
                                Custo este mês:
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="500" sx={{ color: primaryTextColor, textAlign: 'right' }}>
                                ${agent.costMonth.toFixed(2)}
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={() => onToggleActive(agent.id)}
                            sx={{
                                color: agent.active ?
                                    (isDarkMode ? '#ff7b72' : '#d73a49') :
                                    (isDarkMode ? '#7ee787' : '#2ea44f'),
                                border: `1px solid ${borderColor}`,
                                marginLeft: 1
                            }}
                            title={agent.active ? "Desativar agente" : "Ativar agente"}
                        >
                            <PowerSettingsNewIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => onDelete(agent.id)}
                            sx={{
                                color: isDarkMode ? '#ff7b72' : '#d73a49',
                                border: `1px solid ${borderColor}`
                            }}
                            title="Excluir agente"
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
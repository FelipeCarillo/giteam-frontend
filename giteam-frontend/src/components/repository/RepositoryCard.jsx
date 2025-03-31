// components/repository/RepositoryCard.js
import React from 'react';
import { Box, Paper, Typography, Button, Divider, useTheme } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AgentItem from '../agent/AgentItem';
import { canAddAgentToRepository, getAvailableFunctionsForRepository } from '../../services/mockData';

const RepositoryCard = ({ repository, onAddAgent, onToggleActiveAgent, onDeleteAgent }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    
    const primaryColor = theme.palette.primary.main;
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';

    // Verifica se podemos adicionar mais agentes a este repositório
    const availableFunctions = getAvailableFunctionsForRepository(repository);
    const canAddAgent = availableFunctions.length > 0;

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 2,
                backgroundColor: paperBgColor,
                border: `1px solid ${borderColor}`,
                overflow: 'hidden',
                mb: 3
            }}
        >
            <Box sx={{ p: 3, borderBottom: `1px solid ${borderColor}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FolderIcon sx={{ mr: 1, color: primaryColor }} />
                        <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                            <a 
                                href={repository.link} 
                                style={{ textDecoration: 'none', color: primaryTextColor }} 
                                target="_blank" 
                                rel="noreferrer"
                            >
                                {repository.name}
                            </a>
                        </Typography>
                    </Box>
                    {canAddAgent && (
                        <Button
                            variant="outlined"
                            startIcon={<AddCircleOutlineIcon />}
                            size="small"
                            onClick={() => onAddAgent(repository.id)}
                            sx={{
                                borderColor: borderColor,
                                color: secondaryTextColor,
                                '&:hover': {
                                    borderColor: primaryColor,
                                },
                                textTransform: 'none',
                            }}
                        >
                            Adicionar Agente
                        </Button>
                    )}
                </Box>
                
                {!canAddAgent && repository.agents.length > 0 && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: secondaryTextColor }}>
                        {repository.agents.some(a => a.function === 'Both') 
                            ? 'Este repositório já possui um agente Full-Service' 
                            : 'Este repositório já possui todos os tipos de agentes permitidos'}
                    </Typography>
                )}
            </Box>
            
            {repository.agents.map((agent, agentIndex) => (
                <React.Fragment key={agent.id}>
                    {agentIndex > 0 && <Divider sx={{ borderStyle: 'dashed' }} />}
                    <AgentItem 
                        agent={agent} 
                        onToggleActive={onToggleActiveAgent} 
                        onDelete={onDeleteAgent} 
                    />
                </React.Fragment>
            ))}
            
            {repository.agents.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                        Este repositório ainda não possui agentes.
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default RepositoryCard;
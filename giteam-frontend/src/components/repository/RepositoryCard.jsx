// components/repository/RepositoryCard.js
import React from 'react';
import { Box, Paper, Typography, Button, Divider, useTheme } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AgentItem from '../agent/AgentItem';
import { useLanguage } from '../../contexts/LanguageContext';

const RepositoryCard = ({ repository, onAddAgent, onToggleActiveAgent, onDeleteAgent }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const { t } = useLanguage();
    
    const primaryColor = theme.palette.primary.main;
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';

    // ✅ Verifica se podemos adicionar mais agentes baseado na lógica real
    const canAddMoreAgents = () => {
        if (!repository.agents || repository.agents.length === 0) {
            return true; // Pode adicionar o primeiro agente
        }
        
        // Se já tem agente com função "Both", não pode adicionar mais
        const hasBothFunction = repository.agents.some(agent => agent.function === 'Both');
        if (hasBothFunction) {
            return false;
        }
        
        // Se já tem agentes com PR Review e Issue Resolution, não pode adicionar mais
        const hasPRReview = repository.agents.some(agent => agent.function === 'PR Review');
        const hasIssueResolution = repository.agents.some(agent => agent.function === 'Issue Resolution');
        
        if (hasPRReview && hasIssueResolution) {
            return false;
        }
        
        return true; // Pode adicionar mais agentes
    };

    const canAddAgent = canAddMoreAgents();

    // ✅ Função para determinar quais funções estão disponíveis
    const getAvailableFunctions = () => {
        if (!repository.agents || repository.agents.length === 0) {
            return ['PR Review', 'Issue Resolution', 'Both'];
        }
        
        const hasBothFunction = repository.agents.some(agent => agent.function === 'Both');
        if (hasBothFunction) {
            return []; // Nenhuma função disponível
        }
        
        const hasPRReview = repository.agents.some(agent => agent.function === 'PR Review');
        const hasIssueResolution = repository.agents.some(agent => agent.function === 'Issue Resolution');
        
        const available = [];
        if (!hasPRReview) available.push('PR Review');
        if (!hasIssueResolution) available.push('Issue Resolution');
        
        return available;
    };

    // ✅ Função para gerar mensagem de status
    const getStatusMessage = () => {
        if (!repository.agents || repository.agents.length === 0) {
            return null;
        }
        
        const hasBothFunction = repository.agents.some(agent => agent.function === 'Both');
        if (hasBothFunction) {
            return t('fullServiceInRepo') || 'Repositório com serviço completo configurado';
        }
        
        const hasPRReview = repository.agents.some(agent => agent.function === 'PR Review');
        const hasIssueResolution = repository.agents.some(agent => agent.function === 'Issue Resolution');
        
        if (hasPRReview && hasIssueResolution) {
            return t('allAgentInRepo') || 'Todos os tipos de agente já configurados';
        }
        
        return null;
    };

    const statusMessage = getStatusMessage();

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
                                href={repository.link || repository.url} 
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
                            {t('addAgent') || 'Adicionar Agente'}
                        </Button>
                    )}
                </Box>
                
                {/* ✅ Mensagem de status quando não pode adicionar mais agentes */}
                {statusMessage && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: secondaryTextColor }}>
                        {statusMessage}
                    </Typography>
                )}

                {/* ✅ Mostrar funções disponíveis quando pode adicionar */}
                {canAddAgent && repository.agents && repository.agents.length > 0 && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: secondaryTextColor }}>
                        {t('availableFunctions') || 'Funções disponíveis'}: {getAvailableFunctions().join(', ')}
                    </Typography>
                )}
            </Box>
            
            {/* ✅ Lista de agentes com função e modelo visíveis */}
            {repository.agents && repository.agents.length > 0 ? (
                repository.agents.map((agent, agentIndex) => (
                    <React.Fragment key={agent.id}>
                        {agentIndex > 0 && <Divider sx={{ borderStyle: 'dashed' }} />}
                        <AgentItem 
                            agent={agent} 
                            repository={repository.name}
                            onToggleActive={onToggleActiveAgent} 
                            onDelete={onDeleteAgent} 
                        />
                    </React.Fragment>
                ))
            ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                        {t('noAgentsInRepo') || 'Este repositório ainda não possui agentes.'}
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default RepositoryCard;
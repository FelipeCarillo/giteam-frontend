// pages/Repositories.jsx
import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Button, TextField,
    InputAdornment, useTheme, Alert, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import Layout from '../components/layout/Layout';
import RepositoryCard from '../components/repository/RepositoryCard';
import { getRepositories } from '../services/repositories';
import { toggleAgentStatus, deleteAgent } from '../services/agents';
import { useLanguage } from '../contexts/LanguageContext';

const Repositories = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isDarkMode = theme.palette.mode === 'dark';
    const { t } = useLanguage();

    const [repositories, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';

    // ✅ Mapeamento direto dos IDs para nomes dos modelos
    const AI_MODELS_MAP = {
        1: 'GPT-3.5 Turbo',
        2: 'GPT-4',
        3: 'Claude 3 Haiku',
        4: 'Claude 3 Sonnet',
        5: 'Claude 3 Opus'
    };

    // ✅ Função simplificada para obter nome do modelo por ID
    const getModelNameById = (modelId) => {
        if (!modelId) {
            return 'Unknown Model';
        }
        
        return AI_MODELS_MAP[modelId] || `Model ID: ${modelId}`;
    };

    // ✅ Mapear função do agente para formato do componente
    const mapAgentFunction = (apiFunction) => {
        const functionMap = {
            'both': 'Both',
            'pr_review': 'PR Review',
            'issue_resolution': 'Issue Resolution'
        };
        return functionMap[apiFunction] || apiFunction;
    };

    // ✅ Função para enriquecer os dados dos agentes
    const enrichAgentData = (repositories) => {
        return repositories.map(repo => ({
            ...repo,
            link: repo.url, // Adicionar link para compatibilidade
            agents: repo.agents ? repo.agents.map(agent => ({
                ...agent,
                function: mapAgentFunction(agent.function),
                aiModelId: agent.ai_model_id,
                aiModelName: getModelNameById(agent.ai_model_id),
                model: getModelNameById(agent.ai_model_id), // Para compatibilidade com AgentItem
                repository: repo.name,
                repositoryUrl: repo.url,
                repositoryFullName: repo.full_name,
                repositoryId: repo.id,
                responseLength: agent.response_length,
                createdAt: agent.created_at,
                updatedAt: agent.updated_at,
                isPrivate: repo.private
            })) : []
        }));
    };

    // 🔄 Fetch repositories from API
    useEffect(() => {
        const fetchRepositories = async () => {
            setLoading(true);
            setError(null);
            
            try {
                console.log('🔄 Fetching repositories...');
                const data = await getRepositories();
                
                console.log('✅ Repositories fetched:', data);
                
                // Verifica se data tem a propriedade repositories
                if (data && data.repositories && Array.isArray(data.repositories)) {
                    const enrichedRepositories = enrichAgentData(data.repositories);
                    setRepositories(enrichedRepositories);
                } else if (Array.isArray(data)) {
                    // Se data já é um array
                    const enrichedRepositories = enrichAgentData(data);
                    setRepositories(enrichedRepositories);
                } else {
                    console.error("❌ API não retornou um array de repositórios:", data);
                    setRepositories([]);
                    setError("Formato de dados inesperado da API");
                }
                
            } catch (error) {
                console.error('❌ Erro ao buscar repositórios:', error);
                setRepositories([]);
                setError(`Erro ao carregar repositórios: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchRepositories();
    }, []);

    // 🔍 Filter repositories by name
    const filteredRepositories = repositories.filter(repo =>
        repo.name && repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 🧠 Toggle agent status using API
    const handleToggleActiveAgent = async (agentId) => {
        try {
            console.log('🔄 Alternando status do agente:', agentId);
            
            // Encontrar o agente atual para obter seu status
            let currentAgent = null;
            for (const repo of repositories) {
                if (repo.agents) {
                    currentAgent = repo.agents.find(agent => agent.id === agentId);
                    if (currentAgent) break;
                }
            }
            
            if (!currentAgent) {
                throw new Error('Agente não encontrado');
            }
            
            
            // Usar a função corrigida do serviço de agents
            await toggleAgentStatus(agentId, currentAgent.active);
            
            // Atualizar o estado local
            setRepositories(prevRepos => 
                prevRepos.map(repo => ({
                    ...repo,
                    agents: repo.agents ? repo.agents.map(agent => {
                        if (agent.id === agentId) {
                            const newStatus = !agent.active;
                            console.log('✅ Novo status do agente:', newStatus);
                            return { ...agent, active: newStatus };
                        }
                        return agent;
                    }) : []
                }))
            );
            
            console.log('✅ Status do agente alterado com sucesso');
            
        } catch (error) {
            setError(`Erro ao alternar status do agente: ${error.message}`);
        }
    };

    // 🗑️ Delete agent using API
    const handleDeleteAgent = async (agentId) => {
        try {
            console.log('🗑️ Excluindo agente:', agentId);
            
            // Usar a função correta do serviço agents
            await deleteAgent(agentId);
            
            // Atualizar o estado local removendo o agente
            setRepositories(prevRepos => 
                prevRepos.map(repo => ({
                    ...repo,
                    agents: repo.agents ? repo.agents.filter(agent => agent.id !== agentId) : []
                }))
            );
            
            console.log('✅ Agente excluído com sucesso');
        } catch (error) {
            console.error('❌ Erro ao excluir agente:', error);
            setError(`Erro ao excluir agente: ${error.message}`);
        }
    };

    // 🚀 Navigate to add agent page
    const handleAddAgent = (repoId) => {
        console.log('➕ Adding agent to repository:', repoId);
        navigate('/agents/create', { state: { repositoryId: repoId } });
    };

    // 🔄 Refresh repositories
    const handleRefresh = async () => {
        setError(null);
        try {
            setLoading(true);
            const data = await getRepositories();
            
            if (data && data.repositories && Array.isArray(data.repositories)) {
                const enrichedRepositories = enrichAgentData(data.repositories);
                setRepositories(enrichedRepositories);
            } else if (Array.isArray(data)) {
                const enrichedRepositories = enrichAgentData(data);
                setRepositories(enrichedRepositories);
            } else {
                setRepositories([]);
                setError("Formato de dados inesperado da API");
            }
        } catch (error) {
            console.error('❌ Erro ao atualizar repositórios:', error);
            setError(`Erro ao atualizar repositórios: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title={t('repository')}>
            {/* Error Alert */}
            {error && (
                <Alert 
                    severity="error" 
                    sx={{ mb: 3 }}
                    action={
                        <Button color="inherit" size="small" onClick={handleRefresh}>
                            {t('tryAgain')}
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            {/* Search + Add */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    backgroundColor: paperBgColor,
                    border: `1px solid ${borderColor}`,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                        {t('repositoryTitle')}
                    
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={handleRefresh}
                            disabled={loading}
                            sx={{ textTransform: 'none' }}
                        >
                            {loading ? <CircularProgress size={16} /> : t('refresh')}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/agents/create')}
                            sx={{ textTransform: 'none' }}
                        >
                            {t('addRepository')}
                        </Button>
                    </Box>
                </Box>

                <TextField
                    fullWidth
                    placeholder="Search repositories"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outlined"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {/* Repositories Content */}
            {loading ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 2,
                        backgroundColor: paperBgColor,
                        border: `1px solid ${borderColor}`,
                    }}
                >
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="body1" sx={{ color: primaryTextColor }}>
                        {t('loadRepositories')}
                    </Typography>
                </Paper>
            ) : filteredRepositories.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 2,
                        backgroundColor: paperBgColor,
                        border: `1px solid ${borderColor}`,
                    }}
                >
                    <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2 }}>
                        {searchQuery ? 'No repositories match your search.' : 'No repositories found.'}
                    </Typography>
                    {!searchQuery && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/agents/create')}
                            sx={{ textTransform: 'none' }}
                        >
                            {t('addFirstRepositories')}
                        </Button>
                    )}
                </Paper>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {filteredRepositories.map(repo => (
                        <RepositoryCard
                            key={repo.id}
                            repository={repo}
                            onAddAgent={handleAddAgent}
                            onToggleActiveAgent={handleToggleActiveAgent}
                            onDeleteAgent={handleDeleteAgent}
                        />
                    ))}
                </Box>
            )}
        </Layout>
    );
};

export default Repositories;
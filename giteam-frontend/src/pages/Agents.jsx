// pages/Agents.jsx
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    Grid, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    TextField,
    Divider,
    InputAdornment,
    useTheme,
    CircularProgress,
    Alert,
    IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import Layout from '../components/layout/Layout';
import AgentItem from '../components/agent/AgentItem';
import { getRepositories, toggleAgent } from '../services/repositories';
import { deleteAgent, toggleAgentStatus } from '../services/agents'; // ✅ Importar do serviço correto
import { useLanguage } from '../contexts/LanguageContext';

const Agents = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isDarkMode = theme.palette.mode === 'dark';
    const { t, currentLanguage } = useLanguage();

    // Estados
    const [agents, setAgents] = useState([]);
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');

    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';

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

    // Função para transformar dados da API em formato do componente
    const transformApiDataToAgents = (apiData) => {
        const allAgents = [];
        
        if (apiData.repositories) {
            apiData.repositories.forEach(repository => {
                if (repository.agents && repository.agents.length > 0) {
                    repository.agents.forEach(agent => {
                        allAgents.push({
                            id: agent.id,
                            name: agent.name,
                            function: mapAgentFunction(agent.function),
                            repository: repository.name,
                            repositoryUrl: repository.url,
                            repositoryFullName: repository.full_name,
                            repositoryId: repository.id,
                            active: agent.active,
                            responseLength: agent.response_length,
                            aiModelId: agent.ai_model_id,
                            aiModelName: getModelNameById(agent.ai_model_id),
                            model: getModelNameById(agent.ai_model_id), // ✅ Adicionar prop que o AgentItem espera
                            createdAt: agent.created_at,
                            updatedAt: agent.updated_at,
                            isPrivate: repository.private,
                            branches: repository.branches || []
                        });
                    });
                }
            });
        }
        
        return allAgents;
    };

    // Mapear função do agente para formato do componente
    const mapAgentFunction = (apiFunction) => {
        const functionMap = {
            'both': 'Both',
            'pr_review': 'PR Review',
            'issue_resolution': 'Issue Resolution'
        };
        return functionMap[apiFunction] || apiFunction;
    };

    // Carregar dados da API
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                await fetchAgentsData();
                
            } catch (error) {
                console.error('❌ Erro ao carregar dados:', error);
                setError('Erro ao carregar dados. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, []);

    const fetchAgentsData = async () => {
        try {
            console.log('🔄 Carregando dados dos agentes...');
            const response = await getRepositories();
            
            console.log('✅ Dados recebidos da API:', response);
            
            // Armazenar repositórios para referência
            setRepositories(response.repositories || []);
            
            // Transformar dados da API para formato do componente
            const transformedAgents = transformApiDataToAgents(response);
            setAgents(transformedAgents);
            
            console.log('📋 Agentes transformados:', transformedAgents);
            console.log('🔍 Verificando aiModelName:', transformedAgents.map(a => ({ 
                name: a.name, 
                aiModelId: a.aiModelId, 
                aiModelName: a.aiModelName 
            })));
            
        } catch (error) {
            console.error('❌ Erro ao carregar agentes:', error);
            throw error;
        }
    };

    // Filtrar agentes baseado nos critérios de busca e filtros
    const filteredAgents = agents.filter(agent => {
        // Filtro de status
        if (filterStatus === 'active' && !agent.active) return false;
        if (filterStatus === 'inactive' && agent.active) return false;

        // Filtro de tipo/função
        if (filterType !== 'all' && agent.function !== filterType) {
            return false;
        }

        // Filtro de busca
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            return (
                agent.name.toLowerCase().includes(searchLower) ||
                agent.repository.toLowerCase().includes(searchLower) ||
                agent.repositoryFullName.toLowerCase().includes(searchLower) ||
                agent.aiModelName.toLowerCase().includes(searchLower)
            );
        }

        return true;
    });

    // ✅ Alternar status ativo/inativo do agente - Usando função correta
    // ✅ Função corrigida para alternar status ativo/inativo do agente
const handleToggleActiveAgent = async (agentId) => {
    try {
        console.log('🔄 Alternando status do agente:', agentId);
        
        // Encontrar o agente atual para obter seu status
        const currentAgent = agents.find(agent => agent.id === agentId);
        if (!currentAgent) {
            throw new Error('Agente não encontrado');
        }
        
        console.log('📊 Status atual do agente:', currentAgent.active);
        
        // Usar a função corrigida do serviço de agents
        await toggleAgentStatus(agentId, currentAgent.active);
        
        // Atualizar o estado local
        const updatedAgents = agents.map(agent => {
            if (agent.id === agentId) {
                const newStatus = !agent.active;
                console.log('✅ Novo status do agente:', newStatus);
                return { ...agent, active: newStatus };
            }
            return agent;
        });
        
        setAgents(updatedAgents);
        console.log('✅ Status do agente alterado com sucesso');
        
    } catch (error) {
        console.error('❌ Erro ao alternar status do agente:', error);
        setError(`Erro ao alternar status do agente: ${error.message}`);
        
        // Opcional: Recarregar os dados para garantir consistência
        try {
            await fetchAgentsData();
        } catch (refreshError) {
            console.error('❌ Erro ao recarregar dados após falha:', refreshError);
        }
    }
};

    // ✅ Excluir agente - Usando função correta do serviço agents
    const handleDeleteAgent = async (agentId) => {
        try {
            console.log('🗑️ Excluindo agente:', agentId);
            
            // Usar a função correta do serviço agents
            await deleteAgent(agentId);
            
            const updatedAgents = agents.filter(agent => agent.id !== agentId);
            setAgents(updatedAgents);
            
            console.log('✅ Agente excluído com sucesso');
        } catch (error) {
            console.error('❌ Erro ao excluir agente:', error);
            setError('Erro ao excluir agente.');
        }
    };

    const handleCreateNewAgent = () => {
        navigate('/agents/create');
    };

    // Função para recarregar dados
    const handleRefresh = () => {
        const loadData = async () => {
            try {
                setLoading(true);
                await fetchAgentsData();
            } catch (error) {
                setError('Erro ao recarregar dados.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    };

    // Função para fechar erro
    const handleCloseError = () => {
        setError(null);
    };

    return (
        <Layout title={t('titleAgent')}>
            {/* Exibir erro se houver */}
            {error && (
                <Alert 
                    severity="error" 
                    sx={{ mb: 2 }}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={handleCloseError}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {error}
                </Alert>
            )}

            {/* Filtros e Busca */}
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
                    <Box>
                        <Typography variant="h6" fontWeight="500">
                            {t('agentManagement')}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={handleRefresh}
                            disabled={loading}
                            sx={{ textTransform: 'none' }}
                        >
                            {t('refresh')}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={handleCreateNewAgent}
                            sx={{ textTransform: 'none' }}
                        >
                            {t('createAgentNew')}
                        </Button>
                    </Box>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search agents by name, repository, or AI model"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            variant="outlined"
                            size="small"
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                label="Status"
                                disabled={loading}
                            >
                                <MenuItem value="all">{t('statusMenu')}</MenuItem>
                                <MenuItem value="active">{t('statusActive')}</MenuItem>
                                <MenuItem value="inactive">{t('statusInactive')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>{t('typeMenu')}</InputLabel>
                            <Select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                label="Type"
                                disabled={loading}
                            >
                                <MenuItem value="all">{t('allTypes')}</MenuItem>
                                <MenuItem value="PR Review">{t('prReview')}</MenuItem>
                                <MenuItem value="Issue Resolution">{t('issueResolution')}</MenuItem>
                                <MenuItem value="Both">{t('fullService')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* Lista de Agentes */}
            <Paper
                elevation={0}
                sx={{ 
                    borderRadius: 2,
                    backgroundColor: paperBgColor,
                    border: `1px solid ${borderColor}`,
                    overflow: 'hidden',
                }}
            >
                {loading ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <CircularProgress />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            {t('loadAgents')}
                        </Typography>
                    </Box>
                ) : filteredAgents.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        {agents.length === 0 ? (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    {t('agentsFound')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {t('agentsConfigured')}
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={handleCreateNewAgent}
                                    sx={{ mt: 2, textTransform: 'none' }}
                                >
                                    {t('firstAgent')}
                                </Button>
                            </>
                        ) : (
                            <Typography variant="body1">
                                {t('agentsMatch')}
                            </Typography>
                        )}
                    </Box>
                ) : (
                    filteredAgents.map((agent, index) => (
                        <React.Fragment key={agent.id}>
                            {index > 0 && <Divider />}
                            <AgentItem 
                                agent={agent}
                                repository={agent.repository}
                                onToggleActive={handleToggleActiveAgent}
                                onDelete={handleDeleteAgent}
                            />
                        </React.Fragment>
                    ))
                )}
            </Paper>
        </Layout>
    );
};

export default Agents;
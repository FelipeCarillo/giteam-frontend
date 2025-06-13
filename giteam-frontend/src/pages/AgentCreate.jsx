// pages/AgentCreate.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Typography, Paper, Button, Grid, TextField, FormControl, InputLabel, Select,
    MenuItem, Autocomplete, Chip, Radio, RadioGroup, FormControlLabel, FormLabel,
    Stepper, Step, StepLabel, Divider, Alert, useTheme, Card, CardContent,
    CircularProgress, Backdrop
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import Layout from '../components/layout/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { getAvailableRepositories, getRepositoryById } from '../services/repositories';
import { getAiModels } from '../services/agents'; // Import the getAiModels service
import { api } from '../services/api';

const AgentCreate = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const isDarkMode = theme.palette.mode === 'dark';
    const { t, currentLanguage } = useLanguage(); // Get currentLanguage for API call
    const [isLoading, setIsLoading] = useState(false);

    // Pegue o repositoryId do estado da localização, se disponível
    const initialRepoId = location.state?.repositoryId || null;

    const [activeStep, setActiveStep] = useState(0);
    const [agentData, setAgentData] = useState({
        name: '',
        function: '',
        model: '',
        repository: initialRepoId,
        branches: [],
        active: true,
        responseLength: 'medium'
    });

    // Estado para armazenar repositórios, funções e modelos que seriam carregados da API
    const [repositories, setRepositories] = useState([]);
    const [availableFunctions, setAvailableFunctions] = useState([]);
    const [availableModels, setAvailableModels] = useState([]);
    const [responseLengthOptions, setResponseLengthOptions] = useState([]);
    const [isLoadingFunctions, setIsLoadingFunctions] = useState(false);

    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';

    // Passos para o stepper
    const steps = [t('repoAndFunction'), t('modelAndConfig'), t('review')];

    // Carrega dados da API quando o componente montar
    useEffect(() => {
        // Aqui você faria chamadas à API real para carregar os dados
        Promise.all([
            fetchRepositories(),
            fetchAgentFunctions(),
            fetchAvailableModels(),
            fetchResponseLengthOptions(),
        ]).catch(error => {
            console.error('Error fetching initial data:', error);
        });
    }, []);

    // Efeito para atualizar funções disponíveis quando o repositório muda
    useEffect(() => {
        if (agentData.repository) {
            fetchAvailableFunctionsForRepository(agentData.repository);
            setAgentData(prev => ({ ...prev, branches: ['main'] }));
        } else {
            fetchAgentFunctions();
        }
    }, [agentData.repository]);

    // Funções para buscar dados da API
    const fetchRepositories = async () => {
        try {
            const repositories = await getAvailableRepositories();
            setRepositories(repositories.repositories);
        } catch (error) {
            console.error('Error fetching repositories:', error);
        }
    };

    const fetchAgentFunctions = async () => {
        // Em uma implementação real, isso seria uma chamada à API
        // Agora usando as traduções do contexto
        setAvailableFunctions([
            {
                id: 'pr_review',
                title: t('prReviewAgent'),
                description: t('prReviewDesc')
            },
            {
                id: 'issue_resolution',
                title: t('issueResolutionAgent'),
                description: t('issueResolutionDesc')
            },
            {
                id: 'both',
                title: t('fullServiceAgent'),
                description: t('fullServiceDesc')
            }
        ]);
    };

    // Função corrigida para buscar funções disponíveis para um repositório específico
    const fetchAvailableFunctionsForRepository = async (repositoryId) => {
        setIsLoadingFunctions(true); // ADICIONAR ESTA LINHA
        try {
            const repo = await getRepositoryById(repositoryId);

            if (repo.repository && repo.repository.agents && repo.repository.agents.length > 0) {
                const existingAgent = repo.repository.agents[0];
                const agentFunction = existingAgent.function.toLowerCase();

                // Normaliza os nomes das funções para comparação
                const functionMap = {
                    'both': 'both',
                    'pr_review': 'pr_review',
                    'pr review': 'pr_review',
                    'issue_resolution': 'issue_resolution',
                    'issue resolution': 'issue_resolution'
                };

                const normalizedFunction = functionMap[agentFunction] || agentFunction;

                switch (normalizedFunction) {
                    case 'both':
                        // Se já tem agente "both", não permite adicionar outros
                        setAvailableFunctions([]);
                        break;

                    case 'pr_review':
                        // Se tem PR Review, só permite Issue Resolution
                        setAvailableFunctions([
                            {
                                id: 'issue_resolution',
                                title: t('issueResolutionAgent'),
                                description: t('issueResolutionDesc')
                            }
                        ]);
                        break;

                    case 'issue_resolution':
                        // Se tem Issue Resolution, só permite PR Review
                        setAvailableFunctions([
                            {
                                id: 'pr_review',
                                title: t('prReviewAgent'),
                                description: t('prReviewDesc')
                            }
                        ]);
                        break;

                    default:
                        // Função desconhecida, mostra todas as opções
                        fetchAgentFunctions();
                }
            } else {
                // Repositório sem agentes, mostra todas as opções
                fetchAgentFunctions();
            }

        } catch (error) {
            console.error('Error fetching repository functions:', error);
            // Em caso de erro, mostra todas as funções
            fetchAgentFunctions();
        } finally {
            setIsLoadingFunctions(false); // ADICIONAR ESTA LINHA
        }
    };

    const fetchAvailableModels = async () => {
        try {
            const response = await getAiModels(currentLanguage);
            if (response && response.models) {
                setAvailableModels(response.models);
            } else {
                console.warn('No models data received from API');
                setAvailableModels([]);
            }
        } catch (error) {
            console.error('Error fetching AI models:', error);
            // Fallback to empty array or show error message
            setAvailableModels([]);
        }
    };


    const fetchResponseLengthOptions = async () => {
        // Em uma implementação real, isso seria uma chamada à API
        // Agora usando as traduções do contexto
        setResponseLengthOptions([
            {
                id: 'concise',
                title: t('concise'),
                description: t('conciseDesc'),
                tokenPercentage: 0.4
            },
            {
                id: 'medium',
                title: t('medium'),
                description: t('mediumDesc'),
                tokenPercentage: 0.6
            },
            {
                id: 'detailed',
                title: t('detailed'),
                description: t('detailedDesc'),
                tokenPercentage: 1.0
            }
        ]);
    };

    // Função para obter o nome do repositório pelo ID
    const getRepositoryNameById = (repoId) => {
        const repo = repositories.find(r => r.id === repoId);
        return repo ? repo.name : t('notSelected');
    };

    // Handle form changes
    const handleChange = (field) => (event) => {
        setAgentData({
            ...agentData,
            [field]: event.target.value
        });
    };

    const handleBranchesChange = (event, newValue) => {
        setAgentData({
            ...agentData,
            branches: newValue
        });
    };

    // Stepper navigation
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // Form submission
    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const payload = {
                id: agentData.repository,
                agents: [
                    {
                        name: agentData.name,
                        function: agentData.function,
                        ai_model_id: agentData.model,
                        response_length: agentData.responseLength
                    }
                ]
            };

            const response = await api.post('/repositories', payload);
            console.log('Repositório criado com sucesso:', response.data);
            navigate(`/agents/`);
        } catch (error) {
            console.error('Erro ao criar repositório:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    // Validation for each step
    const isStepValid = () => {
        switch (activeStep) {
            case 0: // Repository and Function
                return agentData.function && agentData.repository && !isLoadingFunctions; // ADICIONAR && !isLoadingFunctions
            case 1: // Model and Configuration
                return agentData.name && agentData.model &&
                    ((agentData.function !== 'PR Review' && agentData.function !== 'Both') || agentData.branches.length >= 0);
            default:
                return true;
        }
    };

    // Função para obter o ícone correspondente à função do agente
    const getFunctionIcon = (functionId) => {
        switch (functionId) {
            case 'pr_review':
            case 'PR Review':
                return <CodeIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />;
            case 'issue_resolution':
            case 'Issue Resolution':
                return <BugReportIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />;
            case 'both':
            case 'Both':
                return <SmartToyOutlinedIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />;
            default:
                return null;
        }
    };

    const formatCost = (cost) => {
        if (!cost || cost === 0) return '0.000000';
        if (cost >= 0.000001) {
            return cost.toFixed(6);
        } else {
            // Para valores muito pequenos, mostra em formato decimal com mais casas
            return cost.toFixed(8);
        }
    };

    // Render step content
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <Typography variant="h6" sx={{ mb: 1, color: primaryTextColor }}>
                            {t('selectRepoAndFunction')}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, color: secondaryTextColor }}>
                            {t('repoAgentLimit')}
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>{t('repository')}</InputLabel>
                                    <Select
                                        value={agentData.repository || ''}
                                        onChange={handleChange('repository')}
                                        label={t('repository')}
                                    >
                                        <MenuItem value="">{t('selectRepository')}</MenuItem>
                                        {repositories.map(repo => (
                                            <MenuItem
                                                key={repo.id}
                                                value={repo.id}
                                            >
                                                {repo.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ mb: 2, color: primaryTextColor }}>
                                    {t('selectAgentFunction')}
                                </Typography>

                                <Grid container spacing={2}>
                                    {availableFunctions.map(functionItem => (
                                        <Grid item xs={12} md={4} key={functionItem.id}>
                                            <Card
                                                onClick={() => !isLoadingFunctions && setAgentData({ ...agentData, function: functionItem.id })}
                                                sx={{
                                                    cursor: isLoadingFunctions ? 'not-allowed' : 'pointer', // MODIFICAR ESTA LINHA
                                                    opacity: isLoadingFunctions ? 0.6 : 1, // ADICIONAR ESTA LINHA
                                                    border: `1px solid ${agentData.function === functionItem.id ?
                                                        theme.palette.primary.main :
                                                        borderColor}`,
                                                    backgroundColor: agentData.function === functionItem.id ?
                                                        (isDarkMode ? 'rgba(46, 164, 79, 0.1)' : 'rgba(46, 164, 79, 0.05)') :
                                                        'transparent',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        borderColor: !isLoadingFunctions ? theme.palette.primary.main : borderColor, // MODIFICAR ESTA LINHA
                                                        transform: !isLoadingFunctions ? 'translateY(-2px)' : 'none', // MODIFICAR ESTA LINHA
                                                    }
                                                }}
                                            >
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        {getFunctionIcon(functionItem.id)}
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                ml: 1,
                                                                color: primaryTextColor,
                                                                fontWeight: agentData.function === functionItem.id ? 600 : 500
                                                            }}
                                                        >
                                                            {functionItem.title}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                        {functionItem.description}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>

                                {isLoadingFunctions && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
                                        <CircularProgress size={24} sx={{ mr: 2 }} />
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            {t('loadingFunctions') || 'Carregando funções disponíveis...'}
                                        </Typography>
                                    </Box>
                                )}

                                {availableFunctions.length === 0 && agentData.repository && (
                                    <Alert
                                        severity="info"
                                        sx={{ mt: 2 }}
                                        icon={<InfoIcon />}
                                    >
                                        {t('repositoryLimitReached')}
                                    </Alert>
                                )}
                            </Grid>
                        </Grid>
                    </>
                );

            case 1:
                return (
                    <>
                        <Typography variant="h6" sx={{ mb: 3, color: primaryTextColor }}>
                            {t('configureYourAgent')}
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label={t('agentName')}
                                    value={agentData.name}
                                    onChange={handleChange('name')}
                                    placeholder={t('agentNamePlaceholder')}
                                    helperText={t('chooseDescriptiveName')}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ mb: 2, color: primaryTextColor }}>
                                    {t('selectAIModel')}
                                </Typography>

                                <Grid container spacing={2}>
                                    {availableModels.map(model => (
                                        <Grid item xs={12} sm={6} key={model.id}>
                                            <Paper
                                                elevation={0}
                                                onClick={() => setAgentData({ ...agentData, model: model.id })}
                                                sx={{
                                                    p: 2,
                                                    border: `1px solid ${agentData.model === model.id ? theme.palette.primary.main : borderColor}`,
                                                    borderRadius: 2,
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        borderColor: theme.palette.primary.main,
                                                        backgroundColor: isDarkMode ? 'rgba(46, 164, 79, 0.05)' : 'rgba(46, 164, 79, 0.02)'
                                                    }
                                                }}
                                            >
                                                {agentData.model === model.id && (
                                                    <CheckCircleIcon
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            color: theme.palette.primary.main
                                                        }}
                                                    />
                                                )}

                                                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1, color: 'primaryTextColor' }}>
                                                    {model.name}
                                                </Typography>

                                                <Typography variant="body2" sx={{ color: 'secondaryTextColor', mb: 1 }}>
                                                    {t('provider', { name: model.provider })}
                                                </Typography>

                                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                                    {t('promptCosts')}: ${formatCost(model.prompt_token_cost)}
                                                </Typography>

                                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 2 }}>
                                                    {t('completionCosts')}: ${formatCost(model.completion_token_cost)}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                                    {model.provider}
                                                </Typography>

                                                {Array.isArray(model.specialties) ? (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {model.specialties.map((specialty) => (
                                                            <Chip
                                                                key={specialty}
                                                                label={specialty}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: isDarkMode ? 'rgba(56, 139, 253, 0.15)' : 'rgba(3, 102, 214, 0.1)',
                                                                    color: isDarkMode ? '#58a6ff' : '#0366d6'
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                ) : model.specialties ? (
                                                    <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                        {model.specialties}
                                                    </Typography>
                                                ) : null}

                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>

                                {availableModels.length === 0 && (
                                    <Alert severity="info" sx={{ mt: 2 }}>
                                        {t('loadingModels') || 'Loading AI models...'}
                                    </Alert>
                                )}
                            </Grid>

                            {(agentData.function === 'PR Review' || agentData.function === 'Both') && (
                                <Grid item xs={12}>
                                    <Autocomplete
                                        multiple
                                        value={agentData.branches}
                                        onChange={handleBranchesChange}
                                        options={['main', 'master', 'develop', 'staging', 'production']}
                                        freeSolo
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip
                                                    variant="outlined"
                                                    label={option}
                                                    {...getTagProps({ index })}
                                                />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={t('monitoredBranches')}
                                                placeholder={t('addBranchName')}
                                                helperText={t('branchesToMonitor')}
                                            />
                                        )}
                                    />
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend" sx={{ color: primaryTextColor }}>
                                        {t('responseDetailLevel')}
                                    </FormLabel>
                                    <RadioGroup
                                        value={agentData.responseLength}
                                        onChange={handleChange('responseLength')}
                                        sx={{ mt: 1 }}
                                    >
                                        {responseLengthOptions.map(option => (
                                            <FormControlLabel
                                                key={option.id}
                                                value={option.id}
                                                control={<Radio />}
                                                label={
                                                    <Box>
                                                        <Typography variant="body1" sx={{ color: primaryTextColor }}>
                                                            {option.title}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                            {option.description}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </>
                );

            case 2:
                // Encontra o modelo selecionado
                const selectedModel = availableModels.find(m => m.id === agentData.model);
                // Encontra a opção de comprimento de resposta selecionada
                const selectedResponseLength = responseLengthOptions.find(o => o.id === agentData.responseLength);

                // Calcula os tokens estimados - usando valores padrão se não encontrar
                const maxTokens = selectedModel?.max_tokens || 8000; // valor padrão
                const tokenPercentage = selectedResponseLength?.tokenPercentage || 0.6;
                const estimatedTokens = Math.round(maxTokens * tokenPercentage);

                // Calcula o custo estimado
                const promptCost = selectedModel?.prompt_token_cost || 0;
                const completionCost = selectedModel?.completion_token_cost || 0;
                const avgTokensPerOperation = estimatedTokens;
                const operationsPerDay = 1;
                const daysInMonth = 30;

                // Custo total = (prompt + completion) * tokens * operações * dias
                const totalMonthlyCost = ((promptCost + completionCost) * avgTokensPerOperation * operationsPerDay * daysInMonth) || 0;

                return (
                    <>
                        <Typography variant="h6" sx={{ mb: 3, color: primaryTextColor }}>
                            {t('reviewAgentConfig')}
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        backgroundColor: isDarkMode ? 'rgba(46, 164, 79, 0.05)' : 'rgba(46, 164, 79, 0.02)',
                                        border: `1px solid ${isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)'}`,
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                                                {t('agentName')}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2 }}>
                                                {agentData.name}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                                                {t('function')}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2 }}>
                                                {availableFunctions.find(f => f.id === agentData.function)?.title || t('notSelected')}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                                                {t('repository')}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2 }}>
                                                {getRepositoryNameById(agentData.repository)}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                                                {t('model')}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2 }}>
                                                {availableModels.find(m => m.id === agentData.model)?.name || t('notSelected')}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                                                {t('responseDetail')}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2 }}>
                                                {selectedResponseLength?.title || t('medium')}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                                                {t('estimatedTokens')}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2 }}>
                                                {estimatedTokens.toLocaleString()} {t('of')} {maxTokens.toLocaleString()}
                                            </Typography>
                                        </Grid>

                                        {(agentData.function === 'PR Review' || agentData.function === 'Both') && (
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                                                    {t('monitoredBranches')}
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 2 }}>
                                                    {agentData.branches.map(branch => (
                                                        <Chip
                                                            key={branch}
                                                            label={branch}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: isDarkMode ? 'rgba(56, 139, 253, 0.15)' : 'rgba(3, 102, 214, 0.1)',
                                                                color: isDarkMode ? '#58a6ff' : '#0366d6'
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                            {t('estimatedCost30Days')}
                                        </Typography>

                                        <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 500 }}>
                                            ${totalMonthlyCost.toFixed(4)}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: secondaryTextColor, display: 'block' }}>
                                            {t('basedOnAverage')}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Alert
                                    severity="info"
                                    sx={{
                                        borderRadius: 2,
                                        '& .MuiAlert-message': { color: 'inherit' }
                                    }}
                                >
                                    {t('agentActiveInfo')}
                                </Alert>
                            </Grid>
                        </Grid>
                    </>
                );

            default:
                return 'Unknown step';
        }
    };

    return (
        <Layout title={t('createNewAgentTitle')}>
            <Box sx={{ mb: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleCancel}
                    sx={{
                        mb: 2,
                        color: secondaryTextColor,
                        '&:hover': { color: primaryTextColor }
                    }}
                >
                    {t('back')}
                </Button>

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: paperBgColor,
                        border: `1px solid ${borderColor}`,
                    }}
                >
                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Box sx={{ mt: 2, mb: 4 }}>
                        {getStepContent(activeStep)}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            {t('back')}
                        </Button>
                        <Box>
                            <Button
                                variant="outlined"
                                onClick={handleCancel}
                                sx={{ mr: 1 }}
                            >
                                {t('cancel')}
                            </Button>
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={!isStepValid() || isLoading}
                                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                                >
                                    {isLoading ? (t('creating') || 'Criando...') : t('createAgent')}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={!isStepValid()}
                                >
                                    {t('next')}
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Paper>
            </Box>
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
                open={isLoading}
            >
                <CircularProgress color="inherit" size={60} />
                <Typography variant="h6" sx={{ color: 'white' }}>
                    {t('creating')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {t('waiting')}
                </Typography>
            </Backdrop>

        </Layout>
    );
};

export default AgentCreate;
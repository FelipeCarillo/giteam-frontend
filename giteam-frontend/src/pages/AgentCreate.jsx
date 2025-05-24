// pages/AgentCreate.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    Grid, 
    TextField, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem,
    Autocomplete,
    Chip,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Stepper,
    Step,
    StepLabel,
    Divider,
    Alert,
    useTheme,
    Card,
    CardContent
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

const AgentCreate = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const isDarkMode = theme.palette.mode === 'dark';
    const { t, currentLanguage } = useLanguage(); // Get currentLanguage for API call
    
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
    
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';

    // Passos para o stepper
    const steps = [t('repoAndFunction'), t('modelAndConfig'), t('review')];

    // Carrega dados da API quando o componente montar
    useEffect(() => {
        // Aqui você faria chamadas à API real para carregar os dados
        fetchRepositories();
        fetchAgentFunctions();
        fetchAvailableModels();
        fetchResponseLengthOptions();
    }, []);

    // Efeito para atualizar funções disponíveis quando o repositório muda
    useEffect(() => {
        if (agentData.repository) {
            fetchAvailableFunctionsForRepository(agentData.repository);
            
            // Em uma implementação real, você obteria os branches padrão do repositório
            // Por enquanto, vamos definir 'main' como branch padrão
            setAgentData(prev => ({ ...prev, branches: ['main'] }));
        } else {
            // Quando nenhum repositório é selecionado, mostrar todas as funções
            fetchAgentFunctions();
        }
    }, [agentData.repository]);

    // Efeito para atualizar as traduções quando o idioma muda
    useEffect(() => {
        fetchAgentFunctions();
        fetchResponseLengthOptions();
        fetchAvailableModels(); // Re-fetch models when language changes
        if (agentData.repository) {
            fetchAvailableFunctionsForRepository(agentData.repository);
        }
    }, [t, currentLanguage]); // Added currentLanguage dependency

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

    const fetchAvailableFunctionsForRepository = async (repositoryId) => {
        const repoData = repositories.find(r => r.id === repositoryId);
        if (repoData) {
            const repo = await getRepositoryById(repositoryId);
            if (repo.repository) {
                if (repo.repository.agents.length > 0) {
                    const existingAgent = repo.repository.agents[0];
                    if (existingAgent.function === 'Both') {
                        setAvailableFunctions([]);
                    } else {
                        setAvailableFunctions(availableFunctions.filter(f => f.id !== existingAgent.function));
                    }
                }
            }
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
    const handleSubmit = () => {
        // Em uma aplicação real, isso salvaria o agente no backend
        // Por enquanto, apenas redirecionamos de volta para a página de agentes
        navigate('/agents');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    // Validation for each step
    const isStepValid = () => {
        switch (activeStep) {
            case 0: // Repository and Function
                return agentData.function && agentData.repository;
            case 1: // Model and Configuration
                return agentData.name && agentData.model && 
                       ((agentData.function !== 'PR Review' && agentData.function !== 'Both') || agentData.branches.length > 0);
            default:
                return true;
        }
    };

    // Função para obter o ícone correspondente à função do agente
    const getFunctionIcon = (functionId) => {
        switch(functionId) {
            case 'PR Review':
                return <CodeIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />;
            case 'Issue Resolution':
                return <BugReportIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />;
            case 'Both':
                return <SmartToyOutlinedIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />;
            default:
                return null;
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
                                                onClick={() => setAgentData({ ...agentData, function: functionItem.id })}
                                                sx={{ 
                                                    cursor: 'pointer',
                                                    border: `1px solid ${agentData.function === functionItem.id ? 
                                                        theme.palette.primary.main : 
                                                        borderColor}`,
                                                    backgroundColor: agentData.function === functionItem.id ?
                                                        (isDarkMode ? 'rgba(46, 164, 79, 0.1)' : 'rgba(46, 164, 79, 0.05)') :
                                                        'transparent',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        borderColor: theme.palette.primary.main,
                                                        transform: 'translateY(-2px)',
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
                                                
                                                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1, color: primaryTextColor }}>
                                                    {model.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                                    {t('provider', { name: model.provider })}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 2 }}>
                                                    {t('cost', { cost: model.costPerToken ? model.costPerToken.toFixed(5) : '0.00000' })}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                                    {t('maxTokens', { count: model.maxTokens ? model.maxTokens.toLocaleString() : '0' })}
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
                // Calcula os tokens estimados
                const estimatedTokens = selectedModel 
                    ? Math.round(selectedModel.maxTokens * (selectedResponseLength?.tokenPercentage || 0.6))
                    : 0;
                
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
                                                {estimatedTokens.toLocaleString()} {t('of')} {selectedModel?.maxTokens ? selectedModel.maxTokens.toLocaleString() : 0}
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
                                            ${((selectedModel?.costPerToken || 0) * estimatedTokens * 30).toFixed(2)}
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
                                    disabled={!isStepValid()}
                                >
                                    {t('createAgent')}
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
        </Layout>
    );
};

export default AgentCreate;
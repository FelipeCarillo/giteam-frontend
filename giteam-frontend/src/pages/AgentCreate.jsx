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

const AgentCreate = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const isDarkMode = theme.palette.mode === 'dark';
    
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
    const steps = ['Repositório e Função', 'Modelo e Configuração', 'Revisão'];

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

    // Funções para buscar dados que substituiriam o mockData
    const fetchRepositories = async () => {
        // Em uma implementação real, isso seria uma chamada à API
        // Por enquanto, vamos simular com dados vazios
        setRepositories([
            // Os repositórios seriam carregados da API
            { id: 1, name: 'giteams' },
            { id: 2, name: 'chat-question-awnser' },
            { id: 3, name: 'apaeleilao_backend' },
        ]);
    };

    const fetchAgentFunctions = async () => {
        // Em uma implementação real, isso seria uma chamada à API
        // Por enquanto, vamos simular com dados básicos
        setAvailableFunctions([
            {
                id: 'PR Review',
                title: 'PR Review Agent',
                description: 'Revisa Pull Requests automaticamente, verificando a qualidade do código, possíveis bugs, problemas de segurança e aderência às boas práticas.'
            },
            {
                id: 'Issue Resolution',
                title: 'Issue Resolution Agent',
                description: 'Analisa problemas reportados e fornece possíveis soluções ou passos para debugging.'
            },
            {
                id: 'Both',
                title: 'Full-Service Agent',
                description: 'Combina as capacidades de PR Review e Issue Resolution em um único agente.'
            }
        ]);
    };

    const fetchAvailableFunctionsForRepository = async (repositoryId) => {
        // Em uma implementação real, isso seria uma chamada à API com o ID do repositório
        // Por enquanto, vamos simular com todas as funções disponíveis
        setAvailableFunctions([
            {
                id: 'PR Review',
                title: 'PR Review Agent',
                description: 'Revisa Pull Requests automaticamente, verificando a qualidade do código, possíveis bugs, problemas de segurança e aderência às boas práticas.'
            },
            {
                id: 'Issue Resolution',
                title: 'Issue Resolution Agent',
                description: 'Analisa problemas reportados e fornece possíveis soluções ou passos para debugging.'
            },
            {
                id: 'Both',
                title: 'Full-Service Agent',
                description: 'Combina as capacidades de PR Review e Issue Resolution em um único agente.'
            }
        ]);
    };

    const fetchAvailableModels = async () => {
        // Em uma implementação real, isso seria uma chamada à API
        setAvailableModels([
            { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', costPerToken: 0.00006, specialties: ['Code', 'Reasoning'], maxTokens: 8000 },
            { id: 'gpt-3.5', name: 'GPT-3.5', provider: 'OpenAI', costPerToken: 0.00001, specialties: ['Speed', 'General'], maxTokens: 4000 },
            { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', costPerToken: 0.00005, specialties: ['Documentation', 'Reasoning'], maxTokens: 7000 },
            { id: 'llama-3', name: 'Llama 3', provider: 'Meta', costPerToken: 0.000015, specialties: ['Open Source', 'General'], maxTokens: 4000 },
        ]);
    };

    const fetchResponseLengthOptions = async () => {
        // Em uma implementação real, isso seria uma chamada à API
        setResponseLengthOptions([
            {
                id: 'concise',
                title: 'Conciso',
                description: 'Respostas curtas e diretas (40% dos tokens máximos)',
                tokenPercentage: 0.4
            },
            {
                id: 'medium',
                title: 'Médio',
                description: 'Respostas com nível médio de detalhes (60% dos tokens máximos)',
                tokenPercentage: 0.6
            },
            {
                id: 'detailed',
                title: 'Detalhado',
                description: 'Respostas completas e detalhadas (100% dos tokens máximos)',
                tokenPercentage: 1.0
            }
        ]);
    };

    // Função para obter o nome do repositório pelo ID
    const getRepositoryNameById = (repoId) => {
        const repo = repositories.find(r => r.id === repoId);
        return repo ? repo.name : 'Não selecionado';
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
                       (agentData.function !== 'PR Review' && agentData.function !== 'Both' || agentData.branches.length > 0);
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
                            Selecione o Repositório e a Função do Agente
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, color: secondaryTextColor }}>
                            Um repositório pode ter até 2 agentes com funções diferentes, ou 1 agente "Full-Service"
                        </Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Repositório</InputLabel>
                                    <Select
                                        value={agentData.repository || ''}
                                        onChange={handleChange('repository')}
                                        label="Repositório"
                                    >
                                        <MenuItem value="">Selecione um repositório</MenuItem>
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
                                    Selecione a função do agente:
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
                                        Este repositório já atingiu o limite de agentes.
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
                            Configure seu Agente
                        </Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nome do Agente"
                                    value={agentData.name}
                                    onChange={handleChange('name')}
                                    placeholder="Ex.: CodeReviewer, IssueHelper"
                                    helperText="Escolha um nome descritivo para seu agente"
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ mb: 2, color: primaryTextColor }}>
                                    Selecione o modelo AI:
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
                                                    Provedor: {model.provider}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 2 }}>
                                                    Custo: ${model.costPerToken.toFixed(5)} por token
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                                    Máx. tokens: {model.maxTokens.toLocaleString()}
                                                </Typography>
                                                
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {model.specialties.map(specialty => (
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
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
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
                                                label="Branches Monitoradas"
                                                placeholder="Adicione o nome da branch"
                                                helperText="Adicione as branches que você deseja que este agente monitore"
                                            />
                                        )}
                                    />
                                </Grid>
                            )}
                            
                            <Grid item xs={12}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend" sx={{ color: primaryTextColor }}>
                                        Nível de Detalhamento da Resposta
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
                            Revise a Configuração do Agente
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
                                                Nome do Agente
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2 }}>
                                                {agentData.name}
                                            </Typography>
                                        </Grid>
                                        
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                                                Função
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2 }}>
                                                {availableFunctions.find(f => f.id === agentData.function)?.title || 'Não selecionada'}
                                            </Typography>
                                        </Grid>
                                        
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                                                Repositório
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2 }}>
                                                {getRepositoryNameById(agentData.repository)}
                                            </Typography>
                                        </Grid>
                                        
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                                                Modelo
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2 }}>
                                                {availableModels.find(m => m.id === agentData.model)?.name || 'Não selecionado'}
                                            </Typography>
                                        </Grid>
                                        
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                                                Detalhamento da Resposta
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2 }}>
                                                {selectedResponseLength?.title || 'Médio'}
                                            </Typography>
                                        </Grid>
                                        
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                                                Tokens Estimados
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2 }}>
                                                {estimatedTokens.toLocaleString()} de {selectedModel?.maxTokens.toLocaleString() || 0}
                                            </Typography>
                                        </Grid>
                                        
                                        {(agentData.function === 'PR Review' || agentData.function === 'Both') && (
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" sx={{ color: secondaryTextColor }}>
                                                    Branches Monitoradas
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
                                            Custo estimado para os próximos 30 dias
                                        </Typography>
                                        
                                        <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 500 }}>
                                            ${((selectedModel?.costPerToken || 0) * estimatedTokens * 30).toFixed(2)}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: secondaryTextColor, display: 'block' }}>
                                            Baseado em uma média de 1 operação por dia
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
                                    Seu agente ficará ativo imediatamente após a criação. Você pode pausá-lo a qualquer momento na página de Agentes.
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
        <Layout title="Criar Novo Agente">
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
                    Voltar
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
                            Voltar
                        </Button>
                        <Box>
                            <Button
                                variant="outlined"
                                onClick={handleCancel}
                                sx={{ mr: 1 }}
                            >
                                Cancelar
                            </Button>
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={!isStepValid()}
                                >
                                    Criar Agente
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={!isStepValid()}
                                >
                                    Próximo
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
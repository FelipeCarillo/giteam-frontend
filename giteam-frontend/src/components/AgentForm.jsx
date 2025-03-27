import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Paper,
    Divider,
    Chip,
    Grid,
    Switch,
    FormControlLabel,
    Autocomplete,
    useTheme,
    Alert,
    IconButton,
    Avatar,
    Tooltip,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import MainLayout from '../layouts/MainLayout';

/**
 * Create/Edit Agent Form Component
 * Used for both creating new agents and editing existing ones
 */
function AgentForm({ editMode = false, initialData = null }) {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    
    const primaryColor = theme.palette.primary.main;
    const bgColor = isDarkMode ? '#0d1117' : '#f6f8fa';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';

    // Sample repository data
    const repositories = [
        { id: 1, name: 'giteams', fullName: 'FelipeCarillo/giteam-frontend' },
        { id: 2, name: 'chat-question-awnser', fullName: 'FelipeCarillo/chat-question-awnser' },
        { id: 3, name: 'apaeleilao_backend', fullName: 'FelipeCarillo/apaeleilao_backend' },
        { id: 4, name: 'personal-portfolio', fullName: 'FelipeCarillo/personal-portfolio' },
        { id: 5, name: 'react-native-app', fullName: 'FelipeCarillo/react-native-app' },
    ];

    // Sample branch data by repository
    const branchesByRepo = {
        1: ['main', 'develop', 'feature/auth', 'feature/dashboard'],
        2: ['main', 'develop', 'fix/api-cache'],
        3: ['main', 'develop', 'feature/payment'],
        4: ['main', 'develop'],
        5: ['main'],
    };

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        function: 'PR Review', // 'PR Review', 'Issue Resolution', or 'Both'
        repository: null,
        model: '',
        active: true,
        branches: [],
        description: '',
        promptTemplate: '',
    });
    
    const [errors, setErrors] = useState({});
    const [availableBranches, setAvailableBranches] = useState([]);
    const [formSubmitted, setFormSubmitted] = useState(false);
    
    // LLM model options
    const modelOptions = [
        { value: 'GPT-4', provider: 'OpenAI', costPerToken: '$0.00008', tier: 'premium' },
        { value: 'GPT-3.5', provider: 'OpenAI', costPerToken: '$0.00005', tier: 'standard' },
        { value: 'Claude 3', provider: 'Anthropic', costPerToken: '$0.00011', tier: 'premium' },
        { value: 'Llama 3', provider: 'Meta', costPerToken: '$0.00007', tier: 'standard' },
    ];

    // Load initial data if in edit mode
    useEffect(() => {
        if (editMode && initialData) {
            setFormData({
                ...initialData,
                repository: repositories.find(r => r.id === initialData.repositoryId) || null,
            });
            
            // Load branches for the selected repository
            if (initialData.repositoryId) {
                setAvailableBranches(branchesByRepo[initialData.repositoryId] || []);
            }
        }
    }, [editMode, initialData]);

    // Update available branches when repository changes
    useEffect(() => {
        if (formData.repository) {
            setAvailableBranches(branchesByRepo[formData.repository.id] || []);
            
            // Clear selected branches if repository changed
            if (!editMode || (editMode && initialData && initialData.repositoryId !== formData.repository.id)) {
                setFormData(prev => ({
                    ...prev,
                    branches: [],
                }));
            }
        } else {
            setAvailableBranches([]);
        }
    }, [formData.repository, editMode, initialData]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        
        // Clear error when field is updated
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    // Handle repository selection
    const handleRepositoryChange = (event, newValue) => {
        setFormData(prev => ({
            ...prev,
            repository: newValue,
        }));
        
        // Clear repository error
        if (errors.repository) {
            setErrors(prev => ({
                ...prev,
                repository: null,
            }));
        }
    };

    // Handle branch selection
    const handleBranchChange = (event, newValue) => {
        setFormData(prev => ({
            ...prev,
            branches: newValue,
        }));
    };

    // Handle switch toggle
    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked,
        }));
    };

    // Validate form before submission
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Agent name is required';
        }
        
        if (!formData.repository) {
            newErrors.repository = 'Repository is required';
        }
        
        if (!formData.model) {
            newErrors.model = 'LLM model is required';
        }
        
        if ((formData.function === 'PR Review' || formData.function === 'Both') && formData.branches.length === 0) {
            newErrors.branches = 'Select at least one branch to monitor';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // In a real app, this would send data to an API
            console.log('Form data submitted:', formData);
            setFormSubmitted(true);
            
            // Reset form after submission (in production, would navigate to agent list)
            setTimeout(() => {
                if (!editMode) {
                    setFormData({
                        name: '',
                        function: 'PR Review',
                        repository: null,
                        model: '',
                        active: true,
                        branches: [],
                        description: '',
                        promptTemplate: '',
                    });
                }
                setFormSubmitted(false);
            }, 3000);
        }
    };

    // Get prompt template based on function
    const getDefaultPromptTemplate = () => {
        if (formData.function === 'PR Review') {
            return `You are a helpful PR reviewer. Please analyze the code changes below and provide feedback.

Focus on the following:
1. Code correctness and potential bugs
2. Security vulnerabilities
3. Performance issues
4. Code readability and maintainability
5. Suggestions for improvements

CODE:
{code}

Changes from:
{base_branch} to {head_branch}

Files changed: {files_changed}`;
        } else if (formData.function === 'Issue Resolution') {
            return `You are a helpful assistant for resolving GitHub issues. Please analyze the issue below and provide a solution.

Issue Title: {issue_title}
Issue Description:
{issue_description}

Repository: {repository}
Labels: {labels}`;
        } else {
            return `You are a helpful GitHub assistant. Please analyze the content below and provide appropriate feedback.

Type: {content_type}
Title: {title}
Content:
{content}

Repository: {repository}`;
        }
    };

    return (
        <MainLayout title={editMode ? "Edit Agent" : "Create New Agent"}>
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
                {formSubmitted && (
                    <Alert 
                        severity="success" 
                        sx={{ mb: 3 }}
                        onClose={() => setFormSubmitted(false)}
                    >
                        {editMode ? 'Agent updated successfully!' : 'New agent created successfully!'}
                    </Alert>
                )}
                
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        backgroundColor: paperBgColor,
                        border: `1px solid ${borderColor}`,
                        overflow: 'hidden',
                        mb: 4,
                    }}
                >
                    <Box sx={{ p: 3, borderBottom: `1px solid ${borderColor}`, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 40,
                                    height: 40,
                                    backgroundColor: isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)',
                                    color: isDarkMode ? '#7ee787' : '#2ea44f',
                                    mr: 2
                                }}
                            >
                                <SmartToyOutlinedIcon />
                            </Avatar>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                {editMode ? 'Edit Agent' : 'Create New Agent'}
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            {/* Basic Information */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                    Basic Information
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Agent Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            error={!!errors.name}
                                            helperText={errors.name}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: borderColor,
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl 
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: borderColor,
                                                    },
                                                },
                                            }}
                                        >
                                            <InputLabel>Function</InputLabel>
                                            <Select
                                                name="function"
                                                value={formData.function}
                                                onChange={handleChange}
                                                label="Function"
                                            >
                                                <MenuItem value="PR Review">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CodeIcon sx={{ mr: 1, color: isDarkMode ? '#f0723e' : '#e34c26' }} />
                                                        PR Review
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="Issue Resolution">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <BugReportIcon sx={{ mr: 1, color: isDarkMode ? '#a78ddc' : '#6f42c1' }} />
                                                        Issue Resolution
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="Both">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <SmartToyOutlinedIcon sx={{ mr: 1, color: primaryColor }} />
                                                        Both (PR & Issue)
                                                    </Box>
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Description (Optional)"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            multiline
                                            rows={2}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: borderColor,
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Divider sx={{ borderColor, my: 1 }} />
                            </Grid>
                            
                            {/* Repository Settings */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                    Repository Settings
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            options={repositories}
                                            getOptionLabel={(option) => option.fullName}
                                            value={formData.repository}
                                            onChange={handleRepositoryChange}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Repository"
                                                    required
                                                    error={!!errors.repository}
                                                    helperText={errors.repository}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: borderColor,
                                                            },
                                                        },
                                                    }}
                                                />
                                            )}
                                            renderOption={(props, option) => (
                                                <li {...props}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <GitHubIcon sx={{ mr: 1, color: secondaryTextColor, fontSize: 20 }} />
                                                        {option.fullName}
                                                    </Box>
                                                </li>
                                            )}
                                        />
                                    </Grid>
                                    
                                    {(formData.function === 'PR Review' || formData.function === 'Both') && (
                                        <Grid item xs={12} md={6}>
                                            <Autocomplete
                                                multiple
                                                options={availableBranches}
                                                value={formData.branches}
                                                onChange={handleBranchChange}
                                                disabled={!formData.repository}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Branches to Monitor"
                                                        required
                                                        error={!!errors.branches}
                                                        helperText={errors.branches}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: borderColor,
                                                                },
                                                            },
                                                        }}
                                                    />
                                                )}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <Chip
                                                            variant="outlined"
                                                            label={option}
                                                            {...getTagProps({ index })}
                                                            sx={{
                                                                backgroundColor: isDarkMode ? 'rgba(56, 139, 253, 0.15)' : 'rgba(3, 102, 214, 0.1)',
                                                                color: isDarkMode ? '#58a6ff' : '#0366d6',
                                                                borderColor: isDarkMode ? 'rgba(56, 139, 253, 0.4)' : 'rgba(3, 102, 214, 0.2)',
                                                            }}
                                                        />
                                                    ))
                                                }
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Divider sx={{ borderColor, my: 1 }} />
                            </Grid>
                            
                            {/* Model Settings */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                    LLM Model Settings
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl 
                                            fullWidth 
                                            error={!!errors.model}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: borderColor,
                                                    },
                                                },
                                            }}
                                        >
                                            <InputLabel>LLM Model</InputLabel>
                                            <Select
                                                name="model"
                                                value={formData.model}
                                                onChange={handleChange}
                                                label="LLM Model"
                                            >
                                                {modelOptions.map((model) => (
                                                    <MenuItem key={model.value} value={model.value}>
                                                        <Box sx={{ width: '100%' }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <Typography>{model.value}</Typography>
                                                                <Chip 
                                                                    size="small" 
                                                                    label={model.tier === 'premium' ? 'Premium' : 'Standard'}
                                                                    sx={{
                                                                        backgroundColor: model.tier === 'premium' 
                                                                            ? (isDarkMode ? 'rgba(240, 180, 41, 0.2)' : 'rgba(227, 179, 65, 0.1)')
                                                                            : (isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)'),
                                                                        color: model.tier === 'premium'
                                                                            ? (isDarkMode ? '#f0b429' : '#e3b341')
                                                                            : (isDarkMode ? '#7ee787' : '#2ea44f'),
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                                Provider: {model.provider} • Cost: {model.costPerToken}/token
                                                            </Typography>
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.model && <FormHelperText>{errors.model}</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.active}
                                                    onChange={handleSwitchChange}
                                                    name="active"
                                                    color="primary"
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography sx={{ color: primaryTextColor }}>
                                                        Active Status
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                        {formData.active 
                                                            ? 'Agent will start working immediately after creation' 
                                                            : 'Agent will be created in inactive state'}
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ height: '100%' }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Divider sx={{ borderColor, my: 1 }} />
                            </Grid>
                            
                            {/* Advanced Settings */}
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                        Advanced Settings
                                    </Typography>
                                    <Tooltip title="Custom prompt template to use with the LLM model">
                                        <IconButton size="small" sx={{ color: secondaryTextColor }}>
                                            <HelpOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Custom Prompt Template"
                                            name="promptTemplate"
                                            value={formData.promptTemplate || getDefaultPromptTemplate()}
                                            onChange={handleChange}
                                            multiline
                                            rows={6}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: borderColor,
                                                    },
                                                },
                                                fontFamily: 'monospace',
                                            }}
                                        />
                                        <FormHelperText sx={{ color: secondaryTextColor }}>
                                            Variables in curly braces will be replaced with actual values at runtime.
                                        </FormHelperText>
                                    </Grid>
                                </Grid>
                            </Grid>
                            
                            {/* Form Actions */}
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                    <Button 
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        href="/agents"
                                        sx={{
                                            borderColor: borderColor,
                                            color: secondaryTextColor,
                                            '&:hover': {
                                                borderColor: isDarkMode ? '#f85149' : '#d73a49',
                                            },
                                            textTransform: 'none',
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit"
                                        variant="contained" 
                                        startIcon={<SaveIcon />}
                                        sx={{
                                            backgroundColor: primaryColor,
                                            '&:hover': {
                                                backgroundColor: isDarkMode ? '#3fb950' : '#2c974b',
                                            },
                                            textTransform: 'none',
                                        }}
                                    >
                                        {editMode ? 'Update Agent' : 'Create Agent'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </MainLayout>
    );
}

export default AgentForm;
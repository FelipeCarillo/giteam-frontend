import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    TextField,
    Divider,
    useTheme,
    IconButton,
    Card,
    CardContent,
    Tabs,
    Tab,
    Chip,
    Avatar,
    Switch,
    FormControlLabel,
    Badge,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import FolderIcon from '@mui/icons-material/Folder';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import { getUserInfo } from '../services/auth';
import MainLayout from '../layouts/MainLayout';

function Repositories() {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [filterAgents, setFilterAgents] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const primaryColor = theme.palette.primary.main;
    const bgColor = isDarkMode ? '#0d1117' : '#f6f8fa';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';

    // Sample GitHub repositories data
    const allRepositories = [
        {
            id: 1,
            name: 'giteams',
            fullName: 'FelipeCarillo/giteam-frontend',
            url: 'https://github.com/FelipeCarillo/giteam-frontend',
            description: 'Frontend for GiTeams - GitHub AI agents platform',
            stars: 12,
            forks: 3,
            issues: 5,
            visibility: 'public',
            hasAgents: true,
            agents: [
                {
                    name: 'PRBuddy',
                    function: 'PR Review',
                    model: 'GPT-4',
                    active: true
                }
            ]
        },
        {
            id: 2,
            name: 'chat-question-awnser',
            fullName: 'FelipeCarillo/chat-question-awnser',
            url: 'https://github.com/FelipeCarillo/chat-question-awnser',
            description: 'A chatbot for answering questions using AI',
            stars: 5,
            forks: 0,
            issues: 7,
            visibility: 'public',
            hasAgents: true,
            agents: [
                {
                    name: 'IssueGenius',
                    function: 'Issue Resolution',
                    model: 'Claude 3',
                    active: true
                },
                {
                    name: 'CodeReviewer',
                    function: 'PR Review',
                    model: 'Llama 3',
                    active: false
                }
            ]
        },
        {
            id: 3,
            name: 'apaeleilao_backend',
            fullName: 'FelipeCarillo/apaeleilao_backend',
            url: 'https://github.com/FelipeCarillo/apaeleilao_backend',
            description: 'Backend API for the APAE auction platform',
            stars: 8,
            forks: 2,
            issues: 3,
            visibility: 'public',
            hasAgents: true,
            agents: [
                {
                    name: 'DocHelper',
                    function: 'Both',
                    model: 'GPT-3.5',
                    active: true
                }
            ]
        },
        {
            id: 4,
            name: 'personal-portfolio',
            fullName: 'FelipeCarillo/personal-portfolio',
            url: 'https://github.com/FelipeCarillo/personal-portfolio',
            description: 'My personal portfolio website',
            stars: 3,
            forks: 0,
            issues: 1,
            visibility: 'public',
            hasAgents: false,
            agents: []
        },
        {
            id: 5,
            name: 'react-native-app',
            fullName: 'FelipeCarillo/react-native-app',
            url: 'https://github.com/FelipeCarillo/react-native-app',
            description: 'A React Native mobile application',
            stars: 2,
            forks: 1,
            issues: 4,
            visibility: 'private',
            hasAgents: false,
            agents: []
        },
    ];

    // Filter and sort functionality
    const getFilteredRepositories = () => {
        let filtered = [...allRepositories];
        
        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(repo => 
                repo.name.toLowerCase().includes(searchLower) ||
                repo.fullName.toLowerCase().includes(searchLower) ||
                (repo.description && repo.description.toLowerCase().includes(searchLower))
            );
        }
        
        // Agent filter
        if (filterAgents === 'with-agents') {
            filtered = filtered.filter(repo => repo.hasAgents);
        } else if (filterAgents === 'without-agents') {
            filtered = filtered.filter(repo => !repo.hasAgents);
        }
        
        // Tab filter
        if (tabValue === 1) {
            filtered = filtered.filter(repo => repo.visibility === 'public');
        } else if (tabValue === 2) {
            filtered = filtered.filter(repo => repo.visibility === 'private');
        }
        
        // Sort
        if (sortBy === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'stars') {
            filtered.sort((a, b) => b.stars - a.stars);
        } else if (sortBy === 'agents') {
            filtered.sort((a, b) => b.agents.length - a.agents.length);
        }
        
        return filtered;
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate API call to refresh repository list
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1500);
    };

    const filteredRepositories = getFilteredRepositories();

    return (
        <MainLayout title="Repositories">
            <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
                {/* Page header with stats */}
                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 2,
                                    backgroundColor: paperBgColor,
                                    border: `1px solid ${borderColor}`,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                        GitHub Repositories
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <IconButton 
                                            onClick={handleRefresh}
                                            disabled={isRefreshing}
                                            sx={{ 
                                                color: secondaryTextColor,
                                                border: `1px solid ${borderColor}`,
                                            }}
                                        >
                                            {isRefreshing ? (
                                                <CircularProgress size={20} color="inherit" />
                                            ) : (
                                                <RefreshIcon />
                                            )}
                                        </IconButton>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<GitHubIcon />}
                                            sx={{
                                                borderColor: borderColor,
                                                color: secondaryTextColor,
                                                '&:hover': {
                                                    borderColor: primaryColor,
                                                },
                                                textTransform: 'none',
                                            }}
                                        >
                                            Sync GitHub
                                        </Button>
                                    </Box>
                                </Box>
                                <Divider sx={{ borderColor, mb: 2 }} />
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            Total Repositories
                                        </Typography>
                                        <Typography variant="h4" fontWeight="500" sx={{ color: primaryTextColor }}>
                                            {allRepositories.length}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            With Agents
                                        </Typography>
                                        <Typography variant="h4" fontWeight="500" sx={{ color: primaryTextColor }}>
                                            {allRepositories.filter(r => r.hasAgents).length}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            Public Repos
                                        </Typography>
                                        <Typography variant="h4" fontWeight="500" sx={{ color: primaryTextColor }}>
                                            {allRepositories.filter(r => r.visibility === 'public').length}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            Private Repos
                                        </Typography>
                                        <Typography variant="h4" fontWeight="500" sx={{ color: primaryTextColor }}>
                                            {allRepositories.filter(r => r.visibility === 'private').length}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 2,
                                    backgroundColor: paperBgColor,
                                    border: `1px solid ${borderColor}`,
                                }}
                            >
                                <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                    Agent Allocation
                                </Typography>
                                <Divider sx={{ borderColor, mb: 2 }} />
                                <Box>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                        Repositories with agents vs. without agents
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 1 }}>
                                        <Box sx={{ flex: 1, p: 2, borderRadius: 1, backgroundColor: isDarkMode ? 'rgba(46, 164, 79, 0.1)' : 'rgba(46, 164, 79, 0.05)' }}>
                                            <Typography variant="body2" fontWeight="500" sx={{ color: isDarkMode ? '#7ee787' : '#2ea44f', mb: 1 }}>
                                                With Agents
                                            </Typography>
                                            <Typography variant="h5" fontWeight="500" sx={{ color: isDarkMode ? '#7ee787' : '#2ea44f' }}>
                                                {allRepositories.filter(r => r.hasAgents).length}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: 1, p: 2, borderRadius: 1, backgroundColor: isDarkMode ? 'rgba(56, 139, 253, 0.1)' : 'rgba(3, 102, 214, 0.05)' }}>
                                            <Typography variant="body2" fontWeight="500" sx={{ color: isDarkMode ? '#58a6ff' : '#0366d6', mb: 1 }}>
                                                Without Agents
                                            </Typography>
                                            <Typography variant="h5" fontWeight="500" sx={{ color: isDarkMode ? '#58a6ff' : '#0366d6' }}>
                                                {allRepositories.filter(r => !r.hasAgents).length}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                        Agent function distribution
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Box sx={{ flex: 1, p: 2, borderRadius: 1, backgroundColor: isDarkMode ? 'rgba(240, 81, 35, 0.1)' : 'rgba(240, 81, 35, 0.05)' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CodeIcon fontSize="small" sx={{ color: isDarkMode ? '#f0723e' : '#e34c26', mr: 1 }} />
                                                <Typography variant="body2" fontWeight="500" sx={{ color: isDarkMode ? '#f0723e' : '#e34c26' }}>
                                                    PR Review
                                                </Typography>
                                            </Box>
                                            <Typography variant="h5" fontWeight="500" sx={{ color: isDarkMode ? '#f0723e' : '#e34c26' }}>
                                                {allRepositories.flatMap(r => r.agents).filter(a => a.function === 'PR Review' || a.function === 'Both').length}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: 1, p: 2, borderRadius: 1, backgroundColor: isDarkMode ? 'rgba(121, 83, 210, 0.1)' : 'rgba(121, 83, 210, 0.05)' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <BugReportIcon fontSize="small" sx={{ color: isDarkMode ? '#a78ddc' : '#6f42c1', mr: 1 }} />
                                                <Typography variant="body2" fontWeight="500" sx={{ color: isDarkMode ? '#a78ddc' : '#6f42c1' }}>
                                                    Issue Resolution
                                                </Typography>
                                            </Box>
                                            <Typography variant="h5" fontWeight="500" sx={{ color: isDarkMode ? '#a78ddc' : '#6f42c1' }}>
                                                {allRepositories.flatMap(r => r.agents).filter(a => a.function === 'Issue Resolution' || a.function === 'Both').length}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* Filters and search */}
                <Box sx={{ mb: 3 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: paperBgColor,
                            border: `1px solid ${borderColor}`,
                        }}
                    >
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={5}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Search repositories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ mr: 1, color: secondaryTextColor }} />,
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: borderColor,
                                            },
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                        <InputLabel>Sort By</InputLabel>
                                        <Select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            label="Sort By"
                                        >
                                            <MenuItem value="name">Name</MenuItem>
                                            <MenuItem value="stars">Stars</MenuItem>
                                            <MenuItem value="agents">Agents Count</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl size="small" sx={{ minWidth: 170 }}>
                                        <InputLabel>Filter by Agents</InputLabel>
                                        <Select
                                            value={filterAgents}
                                            onChange={(e) => setFilterAgents(e.target.value)}
                                            label="Filter by Agents"
                                        >
                                            <MenuItem value="all">All Repositories</MenuItem>
                                            <MenuItem value="with-agents">With Agents</MenuItem>
                                            <MenuItem value="without-agents">Without Agents</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>

                {/* Tabs and Repository List */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        backgroundColor: paperBgColor,
                        border: `1px solid ${borderColor}`,
                        overflow: 'hidden',
                    }}
                >
                    <Box sx={{ borderBottom: `1px solid ${borderColor}` }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            sx={{
                                '& .MuiTabs-indicator': {
                                    backgroundColor: primaryColor,
                                },
                            }}
                        >
                            <Tab
                                label={`All Repositories (${allRepositories.length})`}
                                sx={{
                                    textTransform: 'none',
                                    color: tabValue === 0 ? primaryColor : secondaryTextColor,
                                    '&.Mui-selected': {
                                        color: primaryColor,
                                    },
                                }}
                            />
                            <Tab
                                label={`Public (${allRepositories.filter(r => r.visibility === 'public').length})`}
                                sx={{
                                    textTransform: 'none',
                                    color: tabValue === 1 ? primaryColor : secondaryTextColor,
                                    '&.Mui-selected': {
                                        color: primaryColor,
                                    },
                                }}
                            />
                            <Tab
                                label={`Private (${allRepositories.filter(r => r.visibility === 'private').length})`}
                                sx={{
                                    textTransform: 'none',
                                    color: tabValue === 2 ? primaryColor : secondaryTextColor,
                                    '&.Mui-selected': {
                                        color: primaryColor,
                                    },
                                }}
                            />
                        </Tabs>
                    </Box>

                    {/* Repository Grid */}
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            {filteredRepositories.length > 0 ? (
                                filteredRepositories.map(repo => (
                                    <Grid item xs={12} md={6} lg={4} key={repo.id}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                borderRadius: 2,
                                                border: `1px solid ${borderColor}`,
                                                overflow: 'hidden',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    borderColor: primaryColor,
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                },
                                            }}
                                        >
                                            <Box sx={{ p: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <FolderIcon sx={{ color: primaryColor, mr: 1.5 }} />
                                                        <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                            <a href={repo.url} style={{ textDecoration: 'none', color: 'inherit' }} target="_blank" rel="noreferrer">
                                                                {repo.name}
                                                            </a>
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={repo.visibility}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: repo.visibility === 'public' ? 
                                                                (isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)') :
                                                                (isDarkMode ? 'rgba(56, 139, 253, 0.15)' : 'rgba(3, 102, 214, 0.1)'),
                                                            color: repo.visibility === 'public' ?
                                                                (isDarkMode ? '#7ee787' : '#2ea44f') :
                                                                (isDarkMode ? '#58a6ff' : '#0366d6'),
                                                        }}
                                                    />
                                                </Box>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        color: secondaryTextColor, 
                                                        mb: 2,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        height: '40px'
                                                    }}
                                                >
                                                    {repo.description || 'No description provided'}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <StarOutlineIcon fontSize="small" sx={{ color: secondaryTextColor, mr: 0.5 }} />
                                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                            {repo.stars}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <ForkRightIcon fontSize="small" sx={{ color: secondaryTextColor, mr: 0.5 }} />
                                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                            {repo.forks}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <BugReportIcon fontSize="small" sx={{ color: secondaryTextColor, mr: 0.5 }} />
                                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                            {repo.issues}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                
                                                <Divider sx={{ borderColor, mb: 2 }} />
                                                
                                                {/* Agents section */}
                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                        <Typography variant="body2" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                            Agents
                                                        </Typography>
                                                        <Button
                                                            size="small"
                                                            startIcon={<AddCircleOutlineIcon fontSize="small" />}
                                                            sx={{
                                                                color: primaryColor,
                                                                textTransform: 'none',
                                                                padding: '0 8px',
                                                                minWidth: 'auto',
                                                            }}
                                                        >
                                                            Add
                                                        </Button>
                                                    </Box>
                                                    
                                                    {repo.agents.length > 0 ? (
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                            {repo.agents.map((agent, index) => (
                                                                <Box
                                                                    key={index}
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'space-between',
                                                                        p: 1,
                                                                        borderRadius: 1,
                                                                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                                                                        border: `1px solid ${borderColor}`,
                                                                    }}
                                                                >
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <Avatar
                                                                            sx={{
                                                                                width: 28,
                                                                                height: 28,
                                                                                backgroundColor: agent.active ?
                                                                                    (isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)') :
                                                                                    (isDarkMode ? 'rgba(215, 58, 73, 0.2)' : 'rgba(215, 58, 73, 0.1)'),
                                                                                color: agent.active ?
                                                                                    (isDarkMode ? '#7ee787' : '#2ea44f') :
                                                                                    (isDarkMode ? '#ff7b72' : '#d73a49'),
                                                                                mr: 1
                                                                            }}
                                                                        >
                                                                            <SmartToyOutlinedIcon sx={{ fontSize: 16 }} />
                                                                        </Avatar>
                                                                        <Box>
                                                                            <Typography variant="body2" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                                                {agent.name}
                                                                            </Typography>
                                                                            <Typography variant="caption" sx={{ color: secondaryTextColor }}>
                                                                                {agent.function} | {agent.model}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                    <Chip
                                                                        label={agent.active ? 'Active' : 'Inactive'}
                                                                        size="small"
                                                                        sx={{
                                                                            height: 20,
                                                                            fontSize: '0.7rem',
                                                                            backgroundColor: agent.active ?
                                                                                (isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)') :
                                                                                (isDarkMode ? 'rgba(215, 58, 73, 0.2)' : 'rgba(215, 58, 73, 0.1)'),
                                                                            color: agent.active ?
                                                                                (isDarkMode ? '#7ee787' : '#2ea44f') :
                                                                                (isDarkMode ? '#ff7b72' : '#d73a49')
                                                                        }}
                                                                    />
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                                No agents assigned
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                                        <Typography variant="body1" sx={{ color: secondaryTextColor }}>
                                            No repositories found matching your criteria.
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </MainLayout>
    );
}

export default Repositories;
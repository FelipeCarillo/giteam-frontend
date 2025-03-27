import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    useTheme,
    useMediaQuery,
    IconButton,
    Card,
    CardContent,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    Switch,
    FormControlLabel,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { getUserInfo } from '../services/auth';
import MainLayout from '../layouts/MainLayout';

function MyAgents() {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterModel, setFilterModel] = useState('all');
    const [filterFunction, setFilterFunction] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    
    const primaryColor = theme.palette.primary.main;
    const bgColor = isDarkMode ? '#0d1117' : '#f6f8fa';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';

    // Sample agents data
    const allAgents = [
        {
            id: 1,
            name: 'PRBuddy',
            repository: 'giteams',
            repoLink: 'https://github.com/FelipeCarillo/giteam-frontend',
            function: 'PR Review',
            model: 'GPT-4',
            active: true,
            branches: ['main', 'develop'],
            costMonth: 8.75,
            creator: 'felipe@email.com',
            createdAt: '2025-01-10',
            operationsCount: 42
        },
        {
            id: 2,
            name: 'IssueGenius',
            repository: 'chat-question-awnser',
            repoLink: 'https://github.com/FelipeCarillo/chat-question-awnser',
            function: 'Issue Resolution',
            model: 'Claude 3',
            active: true,
            costMonth: 12.30,
            creator: 'felipe@email.com',
            createdAt: '2025-01-15',
            operationsCount: 28
        },
        {
            id: 3,
            name: 'CodeReviewer',
            repository: 'chat-question-awnser',
            repoLink: 'https://github.com/FelipeCarillo/chat-question-awnser',
            function: 'PR Review',
            model: 'Llama 3',
            active: false,
            branches: ['main'],
            costMonth: 5.20,
            creator: 'felipe@email.com',
            createdAt: '2025-02-01',
            operationsCount: 10
        },
        {
            id: 4,
            name: 'DocHelper',
            repository: 'apaeleilao_backend',
            repoLink: 'https://github.com/FelipeCarillo/apaeleilao_backend',
            function: 'Both',
            model: 'GPT-3.5',
            active: true,
            branches: ['main'],
            costMonth: 3.45,
            creator: 'felipe@email.com',
            createdAt: '2025-02-18',
            operationsCount: 15
        },
    ];

    // Filter and search functionality
    const filteredAgents = allAgents.filter(agent => {
        let matches = true;
        
        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            matches = matches && (
                agent.name.toLowerCase().includes(searchLower) ||
                agent.repository.toLowerCase().includes(searchLower) ||
                agent.model.toLowerCase().includes(searchLower)
            );
        }
        
        // Model filter
        if (filterModel !== 'all') {
            matches = matches && agent.model === filterModel;
        }
        
        // Function filter
        if (filterFunction !== 'all') {
            matches = matches && agent.function === filterFunction;
        }
        
        // Status filter
        if (filterStatus !== 'all') {
            matches = matches && (
                (filterStatus === 'active' && agent.active) ||
                (filterStatus === 'inactive' && !agent.active)
            );
        }
        
        return matches;
    });

    // Get agents based on current tab
    const getTabAgents = () => {
        if (tabValue === 0) return filteredAgents;
        if (tabValue === 1) return filteredAgents.filter(agent => agent.active);
        return filteredAgents.filter(agent => !agent.active);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Function to get icon based on agent function
    const getFunctionIcon = (func) => {
        if (func === 'PR Review') return <CodeIcon sx={{ color: primaryColor }} />;
        if (func === 'Issue Resolution') return <BugReportIcon sx={{ color: primaryColor }} />;
        return <SmartToyOutlinedIcon sx={{ color: primaryColor }} />;
    };

    return (
        <MainLayout title="My Agents">
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
                                        Agents Overview
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddCircleOutlineIcon />}
                                        sx={{
                                            backgroundColor: primaryColor,
                                            '&:hover': {
                                                backgroundColor: isDarkMode ? '#3fb950' : '#2c974b',
                                            },
                                            textTransform: 'none',
                                        }}
                                    >
                                        Create New Agent
                                    </Button>
                                </Box>
                                <Divider sx={{ borderColor, mb: 2 }} />
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            Total Agents
                                        </Typography>
                                        <Typography variant="h4" fontWeight="500" sx={{ color: primaryTextColor }}>
                                            {allAgents.length}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            Active Agents
                                        </Typography>
                                        <Typography variant="h4" fontWeight="500" sx={{ color: primaryTextColor }}>
                                            {allAgents.filter(a => a.active).length}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            PR Review Agents
                                        </Typography>
                                        <Typography variant="h4" fontWeight="500" sx={{ color: primaryTextColor }}>
                                            {allAgents.filter(a => a.function === 'PR Review' || a.function === 'Both').length}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            Issue Resolution Agents
                                        </Typography>
                                        <Typography variant="h4" fontWeight="500" sx={{ color: primaryTextColor }}>
                                            {allAgents.filter(a => a.function === 'Issue Resolution' || a.function === 'Both').length}
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
                                    LLM Model Distribution
                                </Typography>
                                <Divider sx={{ borderColor, mb: 2 }} />
                                <Box sx={{ mt: 2 }}>
                                    {/* Model distribution */}
                                    {['GPT-4', 'Claude 3', 'Llama 3', 'GPT-3.5'].map(model => {
                                        const count = allAgents.filter(a => a.model === model).length;
                                        const percentage = (count / allAgents.length) * 100;
                                        
                                        return (
                                            <Box key={model} sx={{ mb: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                                        {model}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                        {count} agents ({percentage.toFixed(0)}%)
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        height: 8,
                                                        width: '100%',
                                                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                                        borderRadius: 1,
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            height: '100%',
                                                            width: `${percentage}%`,
                                                            backgroundColor: primaryColor,
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        );
                                    })}
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
                                    placeholder="Search agents..."
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
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>Model</InputLabel>
                                        <Select
                                            value={filterModel}
                                            onChange={(e) => setFilterModel(e.target.value)}
                                            label="Model"
                                        >
                                            <MenuItem value="all">All Models</MenuItem>
                                            <MenuItem value="GPT-4">GPT-4</MenuItem>
                                            <MenuItem value="Claude 3">Claude 3</MenuItem>
                                            <MenuItem value="Llama 3">Llama 3</MenuItem>
                                            <MenuItem value="GPT-3.5">GPT-3.5</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                        <InputLabel>Function</InputLabel>
                                        <Select
                                            value={filterFunction}
                                            onChange={(e) => setFilterFunction(e.target.value)}
                                            label="Function"
                                        >
                                            <MenuItem value="all">All Functions</MenuItem>
                                            <MenuItem value="PR Review">PR Review</MenuItem>
                                            <MenuItem value="Issue Resolution">Issue Resolution</MenuItem>
                                            <MenuItem value="Both">Both</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            label="Status"
                                        >
                                            <MenuItem value="all">All Status</MenuItem>
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="inactive">Inactive</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>

                {/* Tabs and Agent List */}
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
                                label={`All Agents (${filteredAgents.length})`}
                                sx={{
                                    textTransform: 'none',
                                    color: tabValue === 0 ? primaryColor : secondaryTextColor,
                                    '&.Mui-selected': {
                                        color: primaryColor,
                                    },
                                }}
                            />
                            <Tab
                                label={`Active (${filteredAgents.filter(a => a.active).length})`}
                                sx={{
                                    textTransform: 'none',
                                    color: tabValue === 1 ? primaryColor : secondaryTextColor,
                                    '&.Mui-selected': {
                                        color: primaryColor,
                                    },
                                }}
                            />
                            <Tab
                                label={`Inactive (${filteredAgents.filter(a => !a.active).length})`}
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

                    {/* Agent Table */}
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                                    <TableCell sx={{ color: secondaryTextColor }}>Agent</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Repository</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Function</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Model</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Status</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Monthly Cost</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Operations</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {getTabAgents().map((agent) => (
                                    <TableRow
                                        key={agent.id}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                                            },
                                            borderBottom: `1px solid ${borderColor}`
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar
                                                    sx={{
                                                        width: 36,
                                                        height: 36,
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
                                                <Typography sx={{ color: primaryTextColor, fontWeight: 500 }}>
                                                    {agent.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ color: primaryTextColor }}>
                                                <a href={agent.repoLink} style={{ textDecoration: 'none', color: primaryColor }} target="_blank" rel="noreferrer">
                                                    {agent.repository}
                                                </a>
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={getFunctionIcon(agent.function)}
                                                label={agent.function}
                                                size="small"
                                                sx={{
                                                    backgroundColor: isDarkMode ? 'rgba(56, 139, 253, 0.15)' : 'rgba(3, 102, 214, 0.1)',
                                                    color: isDarkMode ? '#58a6ff' : '#0366d6'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ color: primaryTextColor }}>
                                                {agent.model}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={agent.active ? 'Active' : 'Inactive'}
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
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ color: primaryTextColor }}>
                                                ${agent.costMonth.toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ color: primaryTextColor }}>
                                                {agent.operationsCount}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        color: primaryColor,
                                                        border: `1px solid ${borderColor}`
                                                    }}
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        color: isDarkMode ? '#58a6ff' : '#0366d6',
                                                        border: `1px solid ${borderColor}`
                                                    }}
                                                >
                                                    <SettingsIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        color: agent.active ?
                                                            (isDarkMode ? '#ff7b72' : '#d73a49') :
                                                            (isDarkMode ? '#7ee787' : '#2ea44f'),
                                                        border: `1px solid ${borderColor}`
                                                    }}
                                                >
                                                    <PowerSettingsNewIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        color: isDarkMode ? '#ff7b72' : '#d73a49',
                                                        border: `1px solid ${borderColor}`
                                                    }}
                                                >
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {getTabAgents().length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                            <Typography sx={{ color: secondaryTextColor }}>
                                                No agents found matching your filters.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Container>
        </MainLayout>
    );
}

export default MyAgents;
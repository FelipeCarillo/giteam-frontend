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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    Avatar,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    Menu,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InventoryIcon from '@mui/icons-material/Inventory';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parseISO, subDays } from 'date-fns';
import MainLayout from '../layouts/MainLayout';

function OperationHistory() {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAgent, setFilterAgent] = useState('all');
    const [filterRepository, setFilterRepository] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [startDate, setStartDate] = useState(subDays(new Date(), 30));
    const [endDate, setEndDate] = useState(new Date());
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [sortBy, setSortBy] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
    
    const primaryColor = theme.palette.primary.main;
    const bgColor = isDarkMode ? '#0d1117' : '#f6f8fa';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';

    // Sample operations history data
    const operations = [
        {
            id: 'op-001',
            agentId: 1,
            agentName: 'PRBuddy',
            agentFunction: 'PR Review',
            repository: 'giteams',
            repoLink: 'https://github.com/FelipeCarillo/giteam-frontend',
            operationType: 'PR Review',
            details: 'PR #42: Add authentication flow',
            targetItem: 'PR #42',
            targetLink: 'https://github.com/FelipeCarillo/giteam-frontend/pull/42',
            status: 'completed',
            date: '2025-03-27T10:30:00Z',
            duration: 45, // seconds
            cost: 0.85,
            tokensUsed: 3820,
            modelUsed: 'GPT-4',
            summary: 'Reviewed authentication flow implementation. Found 3 code issues and suggested 2 improvements for security.',
            rawOutput: '# PR Review for Authentication Flow...',
        },
        {
            id: 'op-002',
            agentId: 2,
            agentName: 'IssueGenius',
            agentFunction: 'Issue Resolution',
            repository: 'chat-question-awnser',
            repoLink: 'https://github.com/FelipeCarillo/chat-question-awnser',
            operationType: 'Issue Analysis',
            details: 'Issue #78: API rate limiting not working correctly',
            targetItem: 'Issue #78',
            targetLink: 'https://github.com/FelipeCarillo/chat-question-awnser/issues/78',
            status: 'completed',
            date: '2025-03-26T15:45:00Z',
            duration: 62, // seconds
            cost: 1.25,
            tokensUsed: 5240,
            modelUsed: 'Claude 3',
            summary: 'Analyzed API rate limiting issue. Identified a race condition in the middleware and suggested a fix.',
            rawOutput: '# Issue Analysis for API Rate Limiting...',
        },
        {
            id: 'op-003',
            agentId: 4,
            agentName: 'DocHelper',
            agentFunction: 'Both',
            repository: 'apaeleilao_backend',
            repoLink: 'https://github.com/FelipeCarillo/apaeleilao_backend',
            operationType: 'PR Review',
            details: 'PR #15: Update installation guide',
            targetItem: 'PR #15',
            targetLink: 'https://github.com/FelipeCarillo/apaeleilao_backend/pull/15',
            status: 'completed',
            date: '2025-03-24T09:15:00Z',
            duration: 38, // seconds
            cost: 0.35,
            tokensUsed: 1450,
            modelUsed: 'GPT-3.5',
            summary: 'Reviewed updated installation guide. Suggested improvements for clarity and fixed formatting issues.',
            rawOutput: '# PR Review for Installation Guide...',
        },
        {
            id: 'op-004',
            agentId: 2,
            agentName: 'IssueGenius',
            agentFunction: 'Issue Resolution',
            repository: 'chat-question-awnser',
            repoLink: 'https://github.com/FelipeCarillo/chat-question-awnser',
            operationType: 'Issue Analysis',
            details: 'Issue #82: Memory leak in streaming functionality',
            targetItem: 'Issue #82',
            targetLink: 'https://github.com/FelipeCarillo/chat-question-awnser/issues/82',
            status: 'completed',
            date: '2025-03-22T14:10:00Z',
            duration: 75, // seconds
            cost: 1.65,
            tokensUsed: 7120,
            modelUsed: 'Claude 3',
            summary: 'Analyzed memory leak in streaming functionality. Identified an unclosed EventSource connection and suggested a fix.',
            rawOutput: '# Issue Analysis for Memory Leak...',
        },
        {
            id: 'op-005',
            agentId: 1,
            agentName: 'PRBuddy',
            agentFunction: 'PR Review',
            repository: 'giteams',
            repoLink: 'https://github.com/FelipeCarillo/giteam-frontend',
            operationType: 'PR Review',
            details: 'PR #45: Update user dashboard UI',
            targetItem: 'PR #45',
            targetLink: 'https://github.com/FelipeCarillo/giteam-frontend/pull/45',
            status: 'failed',
            date: '2025-03-21T11:22:00Z',
            duration: 12, // seconds
            cost: 0.10,
            tokensUsed: 450,
            modelUsed: 'GPT-4',
            summary: 'Failed to review PR due to API timeout.',
            rawOutput: 'Error: API timeout after 10 seconds...',
        },
        {
            id: 'op-006',
            agentId: 3,
            agentName: 'CodeReviewer',
            agentFunction: 'PR Review',
            repository: 'chat-question-awnser',
            repoLink: 'https://github.com/FelipeCarillo/chat-question-awnser',
            operationType: 'PR Review',
            details: 'PR #56: Implement caching for API responses',
            targetItem: 'PR #56',
            targetLink: 'https://github.com/FelipeCarillo/chat-question-awnser/pull/56',
            status: 'completed',
            date: '2025-03-20T13:45:00Z',
            duration: 55, // seconds
            cost: 0.95,
            tokensUsed: 4120,
            modelUsed: 'Llama 3',
            summary: 'Reviewed API caching implementation. Suggested using a more efficient cache key generation method.',
            rawOutput: '# PR Review for API Caching...',
        },
        {
            id: 'op-007',
            agentId: 4,
            agentName: 'DocHelper',
            agentFunction: 'Both',
            repository: 'apaeleilao_backend',
            repoLink: 'https://github.com/FelipeCarillo/apaeleilao_backend',
            operationType: 'Issue Analysis',
            details: 'Issue #34: Documentation for new API endpoints missing',
            targetItem: 'Issue #34',
            targetLink: 'https://github.com/FelipeCarillo/apaeleilao_backend/issues/34',
            status: 'completed',
            date: '2025-03-19T16:30:00Z',
            duration: 120, // seconds
            cost: 0.78,
            tokensUsed: 3250,
            modelUsed: 'GPT-3.5',
            summary: 'Generated documentation templates for the new API endpoints based on code analysis.',
            rawOutput: '# API Documentation Templates...',
        },
    ];

    // Filter and sort functionality
    const getFilteredOperations = () => {
        let filtered = [...operations];
        
        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(op => 
                op.agentName.toLowerCase().includes(searchLower) ||
                op.repository.toLowerCase().includes(searchLower) ||
                op.details.toLowerCase().includes(searchLower) ||
                op.operationType.toLowerCase().includes(searchLower)
            );
        }
        
        // Agent filter
        if (filterAgent !== 'all') {
            filtered = filtered.filter(op => op.agentId === Number(filterAgent));
        }
        
        // Repository filter
        if (filterRepository !== 'all') {
            filtered = filtered.filter(op => op.repository === filterRepository);
        }
        
        // Operation type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(op => op.operationType === filterType);
        }
        
        // Date range filter
        filtered = filtered.filter(op => {
            const opDate = new Date(op.date);
            return opDate >= startDate && opDate <= endDate;
        });
        
        // Tab filter
        if (tabValue === 1) {
            filtered = filtered.filter(op => op.status === 'completed');
        } else if (tabValue === 2) {
            filtered = filtered.filter(op => op.status === 'failed');
        }
        
        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'date') {
                return sortDirection === 'asc' 
                    ? new Date(a.date) - new Date(b.date)
                    : new Date(b.date) - new Date(a.date);
            } else if (sortBy === 'cost') {
                return sortDirection === 'asc' 
                    ? a.cost - b.cost
                    : b.cost - a.cost;
            } else if (sortBy === 'duration') {
                return sortDirection === 'asc' 
                    ? a.duration - b.duration
                    : b.duration - a.duration;
            }
            return 0;
        });
        
        return filtered;
    };

    const filteredOperations = getFilteredOperations();
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDirection('desc');
        }
    };

    const openOperationDetails = (operation) => {
        setSelectedOperation(operation);
        setDetailsOpen(true);
    };

    const closeOperationDetails = () => {
        setDetailsOpen(false);
    };

    const handleFilterClick = (event) => {
        setFilterMenuAnchor(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterMenuAnchor(null);
    };

    const isFilterActive = () => {
        return filterAgent !== 'all' || 
               filterRepository !== 'all' || 
               filterType !== 'all' || 
               searchTerm !== '';
    };

    // Calculate totals
    const getTotalCost = () => {
        return operations.reduce((sum, op) => sum + op.cost, 0).toFixed(2);
    };
    
    const getCompletedCount = () => {
        return operations.filter(op => op.status === 'completed').length;
    };
    
    const getFailedCount = () => {
        return operations.filter(op => op.status === 'failed').length;
    };

    // Operation type icons
    const getOperationIcon = (type) => {
        if (type === 'PR Review') {
            return <CodeIcon sx={{ color: isDarkMode ? '#f0723e' : '#e34c26' }} />;
        } else {
            return <BugReportIcon sx={{ color: isDarkMode ? '#a78ddc' : '#6f42c1' }} />;
        }
    };

    return (
        <MainLayout title="Operation History">
            <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
                {/* Page header with stats */}
                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
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
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <InventoryIcon sx={{ mr: 1, color: primaryColor }} />
                                    <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                        Total Operations
                                    </Typography>
                                </Box>
                                <Typography variant="h3" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                    {operations.length}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Chip 
                                        size="small" 
                                        label={`${getCompletedCount()} completed`}
                                        sx={{
                                            backgroundColor: isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)',
                                            color: isDarkMode ? '#7ee787' : '#2ea44f'
                                        }}
                                    />
                                    <Chip 
                                        size="small" 
                                        label={`${getFailedCount()} failed`}
                                        sx={{
                                            backgroundColor: isDarkMode ? 'rgba(215, 58, 73, 0.2)' : 'rgba(215, 58, 73, 0.1)',
                                            color: isDarkMode ? '#ff7b72' : '#d73a49'
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={3}>
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
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <CodeIcon sx={{ mr: 1, color: isDarkMode ? '#f0723e' : '#e34c26' }} />
                                    <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                        PR Reviews
                                    </Typography>
                                </Box>
                                <Typography variant="h3" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                    {operations.filter(op => op.operationType === 'PR Review').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                    Across {new Set(operations.filter(op => op.operationType === 'PR Review').map(op => op.repository)).size} repositories
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={3}>
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
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <BugReportIcon sx={{ mr: 1, color: isDarkMode ? '#a78ddc' : '#6f42c1' }} />
                                    <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                        Issue Analyses
                                    </Typography>
                                </Box>
                                <Typography variant="h3" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                    {operations.filter(op => op.operationType === 'Issue Analysis').length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                    Across {new Set(operations.filter(op => op.operationType === 'Issue Analysis').map(op => op.repository)).size} repositories
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={3}>
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
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                        Total Cost
                                    </Typography>
                                </Box>
                                <Typography variant="h3" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                    ${getTotalCost()}
                                </Typography>
                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                    Avg: ${(getTotalCost() / operations.length).toFixed(2)} per operation
                                </Typography>
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
                                    placeholder="Search operations..."
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
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<FilterListIcon />}
                                            endIcon={<KeyboardArrowDownIcon />}
                                            onClick={handleFilterClick}
                                            sx={{
                                                borderColor: isFilterActive() ? primaryColor : borderColor,
                                                color: isFilterActive() ? primaryColor : secondaryTextColor,
                                                backgroundColor: isFilterActive() ? (isDarkMode ? 'rgba(46, 164, 79, 0.1)' : 'rgba(46, 164, 79, 0.05)') : 'transparent',
                                                textTransform: 'none',
                                            }}
                                        >
                                            Filters {isFilterActive() && '(Active)'}
                                        </Button>
                                        
                                        <Menu
                                            anchorEl={filterMenuAnchor}
                                            open={Boolean(filterMenuAnchor)}
                                            onClose={handleFilterClose}
                                            sx={{ mt: 1 }}
                                        >
                                            <Box sx={{ p: 2, width: 300 }}>
                                                <Typography variant="subtitle2" sx={{ mb: 2, color: primaryTextColor }}>
                                                    Filter Operations
                                                </Typography>
                                                
                                                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                                    <InputLabel>Agent</InputLabel>
                                                    <Select
                                                        value={filterAgent}
                                                        onChange={(e) => setFilterAgent(e.target.value)}
                                                        label="Agent"
                                                    >
                                                        <MenuItem value="all">All Agents</MenuItem>
                                                        <MenuItem value="1">PRBuddy</MenuItem>
                                                        <MenuItem value="2">IssueGenius</MenuItem>
                                                        <MenuItem value="3">CodeReviewer</MenuItem>
                                                        <MenuItem value="4">DocHelper</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                
                                                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                                    <InputLabel>Repository</InputLabel>
                                                    <Select
                                                        value={filterRepository}
                                                        onChange={(e) => setFilterRepository(e.target.value)}
                                                        label="Repository"
                                                    >
                                                        <MenuItem value="all">All Repositories</MenuItem>
                                                        <MenuItem value="giteams">giteams</MenuItem>
                                                        <MenuItem value="chat-question-awnser">chat-question-awnser</MenuItem>
                                                        <MenuItem value="apaeleilao_backend">apaeleilao_backend</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                
                                                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                                    <InputLabel>Operation Type</InputLabel>
                                                    <Select
                                                        value={filterType}
                                                        onChange={(e) => setFilterType(e.target.value)}
                                                        label="Operation Type"
                                                    >
                                                        <MenuItem value="all">All Types</MenuItem>
                                                        <MenuItem value="PR Review">PR Review</MenuItem>
                                                        <MenuItem value="Issue Analysis">Issue Analysis</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                        <DatePicker 
                                                            label="From"
                                                            value={startDate}
                                                            onChange={(newValue) => setStartDate(newValue)}
                                                            slotProps={{ textField: { size: 'small' } }}
                                                            sx={{ flex: 1 }}
                                                        />
                                                        <DatePicker 
                                                            label="To"
                                                            value={endDate}
                                                            onChange={(newValue) => setEndDate(newValue)}
                                                            slotProps={{ textField: { size: 'small' } }}
                                                            sx={{ flex: 1 }}
                                                        />
                                                    </LocalizationProvider>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                                                    <Button
                                                        size="small"
                                                        onClick={() => {
                                                            setFilterAgent('all');
                                                            setFilterRepository('all');
                                                            setFilterType('all');
                                                            setStartDate(subDays(new Date(), 30));
                                                            setEndDate(new Date());
                                                        }}
                                                        sx={{ textTransform: 'none', color: secondaryTextColor }}
                                                    >
                                                        Reset
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={handleFilterClose}
                                                        sx={{ 
                                                            textTransform: 'none',
                                                            backgroundColor: primaryColor,
                                                            '&:hover': {
                                                                backgroundColor: isDarkMode ? '#3fb950' : '#2c974b',
                                                            },
                                                        }}
                                                    >
                                                        Apply
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Menu>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <SortIcon sx={{ color: secondaryTextColor }} />
                                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                                <Select
                                                    value={sortBy}
                                                    onChange={(e) => {
                                                        setSortBy(e.target.value);
                                                    }}
                                                    displayEmpty
                                                    sx={{ '& .MuiSelect-select': { py: 0.7 } }}
                                                >
                                                    <MenuItem value="date">By Date</MenuItem>
                                                    <MenuItem value="cost">By Cost</MenuItem>
                                                    <MenuItem value="duration">By Duration</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <IconButton
                                                size="small"
                                                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                                            >
                                                {sortDirection === 'asc' ? '↑' : '↓'}
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    
                                    <Button
                                        variant="outlined"
                                        startIcon={<DownloadIcon />}
                                        sx={{
                                            borderColor: borderColor,
                                            color: secondaryTextColor,
                                            '&:hover': {
                                                borderColor: primaryColor,
                                            },
                                            textTransform: 'none',
                                        }}
                                    >
                                        Export
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>

                {/* Tabs and Operations Table */}
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
                                label={`All Operations (${operations.length})`}
                                sx={{
                                    textTransform: 'none',
                                    color: tabValue === 0 ? primaryColor : secondaryTextColor,
                                    '&.Mui-selected': {
                                        color: primaryColor,
                                    },
                                }}
                            />
                            <Tab
                                label={`Completed (${getCompletedCount()})`}
                                sx={{
                                    textTransform: 'none',
                                    color: tabValue === 1 ? primaryColor : secondaryTextColor,
                                    '&.Mui-selected': {
                                        color: primaryColor,
                                    },
                                }}
                            />
                            <Tab
                                label={`Failed (${getFailedCount()})`}
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

                    {/* Operations table */}
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                                    <TableCell sx={{ color: secondaryTextColor }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('date')}>
                                            Date
                                            {sortBy === 'date' && (
                                                <Typography sx={{ ml: 0.5, fontSize: '0.8rem' }}>
                                                    {sortDirection === 'asc' ? '↑' : '↓'}
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Agent</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Repository</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Operation</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Status</TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('duration')}>
                                            Duration
                                            {sortBy === 'duration' && (
                                                <Typography sx={{ ml: 0.5, fontSize: '0.8rem' }}>
                                                    {sortDirection === 'asc' ? '↑' : '↓'}
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('cost')}>
                                            Cost
                                            {sortBy === 'cost' && (
                                                <Typography sx={{ ml: 0.5, fontSize: '0.8rem' }}>
                                                    {sortDirection === 'asc' ? '↑' : '↓'}
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: secondaryTextColor }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredOperations
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((operation) => (
                                        <TableRow
                                            key={operation.id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                                                },
                                                borderBottom: `1px solid ${borderColor}`
                                            }}
                                        >
                                            <TableCell>
                                                <Typography sx={{ color: primaryTextColor }}>
                                                    {format(new Date(operation.date), 'MMM d, yyyy')}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: secondaryTextColor }}>
                                                    {format(new Date(operation.date), 'h:mm a')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            backgroundColor: isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)',
                                                            color: isDarkMode ? '#7ee787' : '#2ea44f',
                                                            mr: 1
                                                        }}
                                                    >
                                                        <SmartToyOutlinedIcon sx={{ fontSize: 18 }} />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                                            {operation.agentName}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: secondaryTextColor }}>
                                                            {operation.modelUsed}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                                    <a href={operation.repoLink} style={{ textDecoration: 'none', color: primaryColor }} target="_blank" rel="noreferrer">
                                                        {operation.repository}
                                                    </a>
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            backgroundColor: operation.operationType === 'PR Review' ?
                                                                (isDarkMode ? 'rgba(240, 81, 35, 0.15)' : 'rgba(240, 81, 35, 0.1)') :
                                                                (isDarkMode ? 'rgba(121, 83, 210, 0.15)' : 'rgba(121, 83, 210, 0.1)'),
                                                            mr: 1
                                                        }}
                                                    >
                                                        {getOperationIcon(operation.operationType)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                                            {operation.operationType}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: secondaryTextColor }}>
                                                            <a href={operation.targetLink} style={{ textDecoration: 'none', color: 'inherit' }} target="_blank" rel="noreferrer">
                                                                {operation.targetItem}
                                                            </a>
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label={operation.status === 'completed' ? 'Completed' : 'Failed'}
                                                    sx={{
                                                        backgroundColor: operation.status === 'completed' ?
                                                            (isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)') :
                                                            (isDarkMode ? 'rgba(215, 58, 73, 0.2)' : 'rgba(215, 58, 73, 0.1)'),
                                                        color: operation.status === 'completed' ?
                                                            (isDarkMode ? '#7ee787' : '#2ea44f') :
                                                            (isDarkMode ? '#ff7b72' : '#d73a49'),
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: primaryTextColor }}>
                                                    {operation.duration} seconds
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: secondaryTextColor }}>
                                                    {operation.tokensUsed} tokens
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight="500" sx={{ color: primaryTextColor }}>
                                                    ${operation.cost.toFixed(2)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="View Details">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => openOperationDetails(operation)}
                                                        sx={{
                                                            color: primaryColor,
                                                            border: `1px solid ${borderColor}`
                                                        }}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                {filteredOperations.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                            <Typography sx={{ color: secondaryTextColor }}>
                                                No operations found matching your criteria.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredOperations.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            color: secondaryTextColor,
                            borderTop: `1px solid ${borderColor}`,
                        }}
                    />
                </Paper>

                {/* Operation Details Dialog */}
                {selectedOperation && (
                    <Dialog
                        open={detailsOpen}
                        onClose={closeOperationDetails}
                        maxWidth="md"
                        fullWidth
                        PaperProps={{
                            sx: {
                                backgroundColor: paperBgColor,
                                color: primaryTextColor,
                                borderRadius: 2,
                            }
                        }}
                    >
                        <DialogTitle>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6" fontWeight="500">
                                    Operation Details
                                </Typography>
                                <Chip
                                    size="small"
                                    label={selectedOperation.status === 'completed' ? 'Completed' : 'Failed'}
                                    sx={{
                                        backgroundColor: selectedOperation.status === 'completed' ?
                                            (isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)') :
                                            (isDarkMode ? 'rgba(215, 58, 73, 0.2)' : 'rgba(215, 58, 73, 0.1)'),
                                        color: selectedOperation.status === 'completed' ?
                                            (isDarkMode ? '#7ee787' : '#2ea44f') :
                                            (isDarkMode ? '#ff7b72' : '#d73a49'),
                                    }}
                                />
                            </Box>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                        Agent
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Avatar
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                backgroundColor: isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)',
                                                color: isDarkMode ? '#7ee787' : '#2ea44f',
                                                mr: 1
                                            }}
                                        >
                                            <SmartToyOutlinedIcon sx={{ fontSize: 18 }} />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                {selectedOperation.agentName}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                {selectedOperation.agentFunction}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                        Repository
                                    </Typography>
                                    <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor, mb: 3 }}>
                                        <a href={selectedOperation.repoLink} style={{ textDecoration: 'none', color: primaryColor }} target="_blank" rel="noreferrer">
                                            {selectedOperation.repository}
                                        </a>
                                    </Typography>

                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                        Target
                                    </Typography>
                                    <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor, mb: 3 }}>
                                        <a href={selectedOperation.targetLink} style={{ textDecoration: 'none', color: primaryColor }} target="_blank" rel="noreferrer">
                                            {selectedOperation.targetItem}
                                        </a>
                                    </Typography>

                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                        Operation Type
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Avatar
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                backgroundColor: selectedOperation.operationType === 'PR Review' ?
                                                    (isDarkMode ? 'rgba(240, 81, 35, 0.15)' : 'rgba(240, 81, 35, 0.1)') :
                                                    (isDarkMode ? 'rgba(121, 83, 210, 0.15)' : 'rgba(121, 83, 210, 0.1)'),
                                                mr: 1
                                            }}
                                        >
                                            {getOperationIcon(selectedOperation.operationType)}
                                        </Avatar>
                                        <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                            {selectedOperation.operationType}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                        Date & Time
                                    </Typography>
                                    <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor, mb: 3 }}>
                                        {format(new Date(selectedOperation.date), 'MMM d, yyyy, h:mm a')}
                                    </Typography>

                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                        Model
                                    </Typography>
                                    <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor, mb: 3 }}>
                                        {selectedOperation.modelUsed}
                                    </Typography>

                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                        Metrics
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Duration
                                            </Typography>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                {selectedOperation.duration} seconds
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Tokens
                                            </Typography>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                {selectedOperation.tokensUsed}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Cost
                                            </Typography>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                ${selectedOperation.cost.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                        Operation ID
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 3, fontFamily: 'monospace' }}>
                                        {selectedOperation.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider sx={{ borderColor, my: 1 }} />
                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                        Summary
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: primaryTextColor, mb: 3 }}>
                                        {selectedOperation.summary}
                                    </Typography>

                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                        Raw Output
                                    </Typography>
                                    <Box 
                                        sx={{ 
                                            p: 2, 
                                            backgroundColor: isDarkMode ? 'rgba(13,17,23,0.6)' : 'rgba(246,248,250,0.6)', 
                                            borderRadius: 1,
                                            maxHeight: 200,
                                            overflow: 'auto',
                                            fontFamily: 'monospace',
                                            fontSize: '0.875rem',
                                            color: primaryTextColor,
                                            position: 'relative',
                                        }}
                                    >
                                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                            {selectedOperation.rawOutput}
                                        </pre>
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                                color: secondaryTextColor,
                                            }}
                                            onClick={() => navigator.clipboard.writeText(selectedOperation.rawOutput)}
                                        >
                                            <ContentCopyIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<DescriptionIcon />}
                                sx={{
                                    mr: 'auto',
                                    borderColor: borderColor,
                                    color: secondaryTextColor,
                                    textTransform: 'none',
                                }}
                            >
                                Export as JSON
                            </Button>
                            <Button
                                onClick={closeOperationDetails}
                                sx={{
                                    color: secondaryTextColor,
                                    textTransform: 'none',
                                }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Container>
        </MainLayout>
    );
}

export default OperationHistory;
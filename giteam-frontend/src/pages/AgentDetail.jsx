import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    Divider,
    useTheme,
    IconButton,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Switch,
    FormControlLabel,
    Tooltip,
    Badge,
    Card,
    CardContent,
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import GitHubIcon from '@mui/icons-material/GitHub';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SettingsIcon from '@mui/icons-material/Settings';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DescriptionIcon from '@mui/icons-material/Description';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FolderIcon from '@mui/icons-material/Folder';
import { format } from 'date-fns';
import MainLayout from '../layouts/MainLayout';

/**
 * Agent Detail Page Component
 * Displays detailed information about a specific agent
 */
function AgentDetail() {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [tabValue, setTabValue] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [operationDetailsOpen, setOperationDetailsOpen] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState(null);

    const primaryColor = theme.palette.primary.main;
    const bgColor = isDarkMode ? '#0d1117' : '#f6f8fa';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';

    // Sample agent data
    const agent = {
        id: 1,
        name: 'PRBuddy',
        function: 'PR Review',
        repository: 'giteams',
        repoLink: 'https://github.com/FelipeCarillo/giteam-frontend',
        model: 'GPT-4',
        active: true,
        branches: ['main', 'develop'],
        costMonth: 8.75,
        costTotal: 52.40,
        creator: 'felipe@email.com',
        createdAt: '2025-01-10',
        lastOperation: '2025-03-27T10:30:00Z',
        description: 'Reviews PRs for the frontend project, focusing on code quality and security issues.',
        operationsCount: {
            total: 38,
            completed: 36,
            failed: 2,
        },
        responseTime: {
            average: 45, // seconds
            min: 32,
            max: 68,
        },
        promptTemplate: `You are a helpful PR reviewer. Please analyze the code changes below and provide feedback.

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

Files changed: {files_changed}`,
    };

    // Sample operations data
    const operations = [
        {
            id: 'op-001',
            type: 'PR Review',
            details: 'PR #42: Add authentication flow',
            targetItem: 'PR #42',
            targetLink: 'https://github.com/FelipeCarillo/giteam-frontend/pull/42',
            status: 'completed',
            date: '2025-03-27T10:30:00Z',
            duration: 45, // seconds
            cost: 0.85,
            tokensUsed: 3820,
            branchFrom: 'feature/auth',
            branchTo: 'develop',
            filesChanged: 8,
            summary: 'Reviewed authentication flow implementation. Found 3 code issues and suggested 2 improvements for security.',
            rawOutput: '# PR Review for Authentication Flow\n\n## Summary\nThis PR implements user authentication flow including login, registration, and password reset functionality. Overall the implementation is solid with good separation of concerns and error handling, but I found a few issues that should be addressed.\n\n## Security Issues\n1. **Password Storage**: The password is being transmitted in plaintext to the API. Consider using client-side hashing before transmission.\n2. **Token Handling**: JWT tokens are stored in localStorage which is vulnerable to XSS attacks. Consider using httpOnly cookies instead.\n\n## Code Issues\n1. **Error Handling**: Line 67 has an uncaught promise rejection if the API call fails.\n2. **Memory Leak**: The useEffect hook in AuthProvider.jsx doesn\'t clean up on unmount.\n3. **Performance**: The useCallback hook on lines 120-135 has missing dependencies.\n\n## Suggestions\n1. Add loading states to prevent multiple form submissions\n2. Consider implementing rate limiting for login attempts\n3. Add unit tests for the auth utilities\n\nOverall this is a good implementation that needs a few security improvements before being ready for production.',
        },
        {
            id: 'op-002',
            type: 'PR Review',
            details: 'PR #45: Update user dashboard UI',
            targetItem: 'PR #45',
            targetLink: 'https://github.com/FelipeCarillo/giteam-frontend/pull/45',
            status: 'completed',
            date: '2025-03-25T14:15:00Z',
            duration: 38, // seconds
            cost: 0.72,
            tokensUsed: 3240,
            branchFrom: 'feature/dashboard',
            branchTo: 'develop',
            filesChanged: 5,
            summary: 'Reviewed dashboard UI updates. Found some accessibility issues and suggested layout improvements.',
            rawOutput: '# PR Review for Dashboard UI Update\n\n## Summary\nThis PR updates the user dashboard with a new layout and additional analytics components. The design looks clean and modern, but there are a few accessibility and responsive design issues to address.\n\n## Accessibility Issues\n1. **Color Contrast**: The light gray text (#8b949e) on white background doesn\'t meet WCAG 2.1 AA standards.\n2. **Missing Alt Text**: Several images are missing alt text attributes.\n3. **Keyboard Navigation**: The custom dropdown component isn\'t properly keyboard accessible.\n\n## Code Issues\n1. **Duplicate IDs**: There are duplicate HTML IDs on lines 78 and 152.\n2. **Console Errors**: Remove console.log statements before production.\n\n## Responsive Design\n1. The grid layout breaks on mobile viewports under 375px width.\n2. Consider using flexbox instead of fixed widths for the chart containers.\n\n## Suggestions\n1. Add proper loading states for the data fetching components\n2. Consider using a more accessible color palette\n3. Implement skeleton loaders for better perceived performance\n\nOverall good visual improvements that need some accessibility and responsive design fixes.',
        },
        {
            id: 'op-003',
            type: 'PR Review',
            details: 'PR #48: Fix responsive layout issues',
            targetItem: 'PR #48',
            targetLink: 'https://github.com/FelipeCarillo/giteam-frontend/pull/48',
            status: 'failed',
            date: '2025-03-22T09:45:00Z',
            duration: 12, // seconds
            cost: 0.10,
            tokensUsed: 450,
            branchFrom: 'fix/responsive',
            branchTo: 'develop',
            filesChanged: 3,
            summary: 'Failed to review PR due to API timeout.',
            rawOutput: 'Error: API timeout after 10 seconds. The operation was terminated before completion.\n\nPossible causes:\n1. The LLM provider service is experiencing high load\n2. The PR contains an unusually large number of changes\n3. Network connectivity issues\n\nPlease try again later or consider breaking the PR into smaller changes.',
        },
        {
            id: 'op-004',
            type: 'PR Review',
            details: 'PR #50: Implement dark mode theme',
            targetItem: 'PR #50',
            targetLink: 'https://github.com/FelipeCarillo/giteam-frontend/pull/50',
            status: 'completed',
            date: '2025-03-20T16:30:00Z',
            duration: 52, // seconds
            cost: 0.98,
            tokensUsed: 4120,
            branchFrom: 'feature/dark-mode',
            branchTo: 'develop',
            filesChanged: 12,
            summary: 'Reviewed dark mode implementation. Found several theme inconsistencies and suggested optimizations for theme switching.',
            rawOutput: '# PR Review for Dark Mode Implementation\n\n## Summary\nThis PR adds a dark mode theme to the application using Material UI\'s theme provider and CSS variables. The implementation is mostly well-structured but there are some inconsistencies in how the theme is applied throughout the application.\n\n## Theme Implementation Issues\n1. **Inconsistent Color Usage**: Some components use hardcoded colors instead of theme variables.\n2. **Missing Dark Mode Styles**: Several components don\'t have proper dark mode styles defined (forms, tables, tooltips).\n3. **Theme Switching Logic**: The theme persistence logic has a race condition when loading the saved preference.\n\n## Performance Issues\n1. **Unnecessary Re-renders**: The ThemeProvider is causing re-renders of the entire app on theme change. Consider using React.memo or shouldComponentUpdate to optimize.\n2. **CSS Variables**: Some CSS variables are being recomputed on every render - move to a useCallback or useMemo hook.\n\n## Suggestions\n1. Use a dedicated color palette object instead of scattered color definitions\n2. Add proper color contrast testing for accessibility compliance\n3. Consider implementing automatic theme switching based on user OS preference\n4. Add transition animations when switching themes\n\nOverall a good start but needs more consistency in the theme implementation and some performance optimizations.',
        },
    ];

    // Sample chart data for operations over time
    const operationsChartData = [
        { date: '2025-03-01', operations: 2, cost: 1.65 },
        { date: '2025-03-02', operations: 0, cost: 0 },
        { date: '2025-03-03', operations: 1, cost: 0.82 },
        { date: '2025-03-04', operations: 3, cost: 2.45 },
        { date: '2025-03-05', operations: 2, cost: 1.75 },
        { date: '2025-03-06', operations: 1, cost: 0.95 },
        { date: '2025-03-07', operations: 0, cost: 0 },
        { date: '2025-03-08', operations: 0, cost: 0 },
        { date: '2025-03-09', operations: 2, cost: 1.84 },
        { date: '2025-03-10', operations: 1, cost: 0.76 },
        { date: '2025-03-11', operations: 2, cost: 1.68 },
        { date: '2025-03-12', operations: 3, cost: 2.52 },
        { date: '2025-03-13', operations: 1, cost: 0.88 },
        { date: '2025-03-14', operations: 2, cost: 1.76 },
        { date: '2025-03-15', operations: 0, cost: 0 },
        { date: '2025-03-16', operations: 0, cost: 0 },
        { date: '2025-03-17', operations: 1, cost: 0.92 },
        { date: '2025-03-18', operations: 2, cost: 1.85 },
        { date: '2025-03-19', operations: 2, cost: 1.78 },
        { date: '2025-03-20', operations: 1, cost: 0.98 },
        { date: '2025-03-21', operations: 0, cost: 0 },
        { date: '2025-03-22', operations: 1, cost: 0.10 },
        { date: '2025-03-23', operations: 0, cost: 0 },
        { date: '2025-03-24', operations: 0, cost: 0 },
        { date: '2025-03-25', operations: 1, cost: 0.72 },
        { date: '2025-03-26', operations: 0, cost: 0 },
        { date: '2025-03-27', operations: 1, cost: 0.85 },
    ];

    // Success rate pie chart data
    const successRateData = [
        { name: 'Success', value: agent.operationsCount.completed, color: isDarkMode ? '#7ee787' : '#2ea44f' },
        { name: 'Failed', value: agent.operationsCount.failed, color: isDarkMode ? '#ff7b72' : '#d73a49' },
    ];

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle dialog toggles
    const handleDeleteDialogOpen = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    const openOperationDetails = (operation) => {
        setSelectedOperation(operation);
        setOperationDetailsOpen(true);
    };

    const closeOperationDetails = () => {
        setOperationDetailsOpen(false);
    };

    // Toggle agent active status
    const toggleAgentStatus = () => {
        console.log(`Toggling agent status from ${agent.active ? 'active' : 'inactive'} to ${agent.active ? 'inactive' : 'active'}`);
        // In a real app, this would call an API to update the agent status
    };

    // Copy prompt template
    const copyPromptTemplate = () => {
        navigator.clipboard.writeText(agent.promptTemplate);
    };

    return (
        <MainLayout title={`Agent: ${agent.name}`}>
            <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
                {/* Agent Header Card */}
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    badgeContent={
                                        agent.function === 'PR Review'
                                            ? <CodeIcon fontSize="small" sx={{ color: isDarkMode ? '#f0723e' : '#e34c26' }} />
                                            : agent.function === 'Issue Resolution'
                                                ? <BugReportIcon fontSize="small" sx={{ color: isDarkMode ? '#a78ddc' : '#6f42c1' }} />
                                                : <SmartToyOutlinedIcon fontSize="small" sx={{ color: primaryColor }} />
                                    }
                                >
                                    <Avatar
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            backgroundColor: agent.active
                                                ? (isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)')
                                                : (isDarkMode ? 'rgba(215, 58, 73, 0.2)' : 'rgba(215, 58, 73, 0.1)'),
                                            color: agent.active
                                                ? (isDarkMode ? '#7ee787' : '#2ea44f')
                                                : (isDarkMode ? '#ff7b72' : '#d73a49'),
                                            mr: 2
                                        }}
                                    >
                                        <SmartToyOutlinedIcon />
                                    </Avatar>
                                </Badge>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                        <Typography variant="h5" fontWeight="500" sx={{ color: primaryTextColor, mr: 2 }}>
                                            {agent.name}
                                        </Typography>
                                        <Chip
                                            label={agent.active ? 'Active' : 'Inactive'}
                                            size="small"
                                            sx={{
                                                backgroundColor: agent.active
                                                    ? (isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)')
                                                    : (isDarkMode ? 'rgba(215, 58, 73, 0.2)' : 'rgba(215, 58, 73, 0.1)'),
                                                color: agent.active
                                                    ? (isDarkMode ? '#7ee787' : '#2ea44f')
                                                    : (isDarkMode ? '#ff7b72' : '#d73a49')
                                            }}
                                        />
                                        <Chip
                                            label={agent.function}
                                            size="small"
                                            sx={{
                                                ml: 1,
                                                backgroundColor: agent.function === 'PR Review'
                                                    ? (isDarkMode ? 'rgba(240, 81, 35, 0.15)' : 'rgba(240, 81, 35, 0.1)')
                                                    : agent.function === 'Issue Resolution'
                                                        ? (isDarkMode ? 'rgba(121, 83, 210, 0.15)' : 'rgba(121, 83, 210, 0.1)')
                                                        : (isDarkMode ? 'rgba(56, 139, 253, 0.15)' : 'rgba(3, 102, 214, 0.1)'),
                                                color: agent.function === 'PR Review'
                                                    ? (isDarkMode ? '#f0723e' : '#e34c26')
                                                    : agent.function === 'Issue Resolution'
                                                        ? (isDarkMode ? '#a78ddc' : '#6f42c1')
                                                        : (isDarkMode ? '#58a6ff' : '#0366d6')
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <FolderIcon sx={{ fontSize: 16, color: secondaryTextColor, mr: 0.5 }} />
                                        <Typography variant="body2" sx={{ color: secondaryTextColor, mr: 2 }}>
                                            <a href={agent.repoLink} style={{ textDecoration: 'none', color: primaryColor }} target="_blank" rel="noreferrer">
                                                {agent.repository}
                                            </a>
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            Model: {agent.model}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    color={agent.active ? "error" : "primary"}
                                    onClick={toggleAgentStatus}
                                    startIcon={<PowerSettingsNewIcon />}
                                    sx={{
                                        borderColor: agent.active ? (isDarkMode ? '#f85149' : '#d73a49') : borderColor,
                                        color: agent.active ? (isDarkMode ? '#f85149' : '#d73a49') : primaryColor,
                                        '&:hover': {
                                            borderColor: agent.active ? (isDarkMode ? '#da3633' : '#cb2431') : primaryColor,
                                            backgroundColor: agent.active
                                                ? (isDarkMode ? 'rgba(248,81,73,0.1)' : 'rgba(215,58,73,0.1)')
                                                : 'transparent',
                                        },
                                        textTransform: 'none',
                                    }}
                                >
                                    {agent.active ? 'Deactivate' : 'Activate'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    href={`/agents/edit/${agent.id}`}
                                    sx={{
                                        borderColor: borderColor,
                                        color: secondaryTextColor,
                                        '&:hover': {
                                            borderColor: primaryColor,
                                        },
                                        textTransform: 'none',
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={handleDeleteDialogOpen}
                                    sx={{
                                        borderColor: isDarkMode ? '#f85149' : '#d73a49',
                                        color: isDarkMode ? '#f85149' : '#d73a49',
                                        '&:hover': {
                                            borderColor: isDarkMode ? '#da3633' : '#cb2431',
                                            backgroundColor: isDarkMode ? 'rgba(248,81,73,0.1)' : 'rgba(215,58,73,0.1)',
                                        },
                                        textTransform: 'none',
                                    }}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={9}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 0.5 }}>
                                        Description
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: primaryTextColor }}>
                                        {agent.description || 'No description provided.'}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 0.5 }}>
                                        Repository Branches
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {agent.branches.map(branch => (
                                            <Chip
                                                key={branch}
                                                label={branch}
                                                size="small"
                                                sx={{
                                                    backgroundColor: isDarkMode ? 'rgba(56, 139, 253, 0.15)' : 'rgba(3, 102, 214, 0.1)',
                                                    color: isDarkMode ? '#58a6ff' : '#0366d6',
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 0.5 }}>
                                        Created By
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2 }}>
                                        {agent.creator}
                                    </Typography>

                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 0.5 }}>
                                        Created On
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2 }}>
                                        {format(new Date(agent.createdAt), 'MMMM d, yyyy')}
                                    </Typography>

                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 0.5 }}>
                                        Last Operation
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: primaryTextColor }}>
                                        {format(new Date(agent.lastOperation), 'MMMM d, yyyy h:mm a')}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>

                {/* Agent Stats Cards */}
                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
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
                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                    Total Operations
                                </Typography>
                                <Typography variant="h3" fontWeight="500" sx={{ color: primaryTextColor, mb: 1 }}>
                                    {agent.operationsCount.total}
                                </Typography>
                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                    Success Rate: {((agent.operationsCount.completed / agent.operationsCount.total) * 100).toFixed(1)}%
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
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
                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                    Average Response Time
                                </Typography>
                                <Typography variant="h3" fontWeight="500" sx={{ color: primaryTextColor, mb: 1 }}>
                                    {agent.responseTime.average}s
                                </Typography>
                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                    Range: {agent.responseTime.min}s - {agent.responseTime.max}s
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
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
                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                    Monthly Cost
                                </Typography>
                                <Typography variant="h3" fontWeight="500" sx={{ color: primaryTextColor, mb: 1 }}>
                                    ${agent.costMonth.toFixed(2)}
                                </Typography>
                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                    ~${(agent.costMonth / agent.operationsCount.total).toFixed(2)} per operation
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
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
                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                    Total Cost
                                </Typography>
                                <Typography variant="h3" fontWeight="500" sx={{ color: primaryTextColor, mb: 1 }}>
                                    ${agent.costTotal.toFixed(2)}
                                </Typography>
                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                    Since {format(new Date(agent.createdAt), 'MMMM d, yyyy')}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* Tabs and content */}
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
                                label="Activity"
                                sx={{
                                    textTransform: 'none',
                                    color: tabValue === 0 ? primaryColor : secondaryTextColor,
                                    '&.Mui-selected': {
                                        color: primaryColor,
                                    },
                                }}
                            />
                            <Tab
                                label="Analytics"
                                sx={{
                                    textTransform: 'none',
                                    color: tabValue === 1 ? primaryColor : secondaryTextColor,
                                    '&.Mui-selected': {
                                        color: primaryColor,
                                    },
                                }}
                            />
                            <Tab
                                label="Settings"
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

                    {/* Tab content */}
                    <Box sx={{ p: 0 }}>
                        {/* Activity Tab */}
                        {tabValue === 0 && (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                                            <TableCell sx={{ color: secondaryTextColor }}>Date</TableCell>
                                            <TableCell sx={{ color: secondaryTextColor }}>Operation</TableCell>
                                            <TableCell sx={{ color: secondaryTextColor }}>Status</TableCell>
                                            <TableCell sx={{ color: secondaryTextColor }}>Duration</TableCell>
                                            <TableCell sx={{ color: secondaryTextColor }}>Cost</TableCell>
                                            <TableCell sx={{ color: secondaryTextColor }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {operations
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
                                                                    width: 28,
                                                                    height: 28,
                                                                    backgroundColor: operation.type === 'PR Review' ?
                                                                        (isDarkMode ? 'rgba(240, 81, 35, 0.15)' : 'rgba(240, 81, 35, 0.1)') :
                                                                        (isDarkMode ? 'rgba(121, 83, 210, 0.15)' : 'rgba(121, 83, 210, 0.1)'),
                                                                    color: operation.type === 'PR Review' ?
                                                                        (isDarkMode ? '#f0723e' : '#e34c26') :
                                                                        (isDarkMode ? '#a78ddc' : '#6f42c1'),
                                                                    mr: 1
                                                                }}
                                                            >
                                                                {operation.type === 'PR Review' ? <CodeIcon /> : <BugReportIcon />}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                                                    {operation.details}
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
                                        {operations.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ py: 3, color: secondaryTextColor }}>
                                                    No operations found for this agent.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={operations.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    sx={{
                                        color: secondaryTextColor,
                                        borderTop: `1px solid ${borderColor}`,
                                    }}
                                />
                            </TableContainer>
                        )}

                        {/* Analytics Tab */}
                        {tabValue === 1 && (
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={3}>
                                    {/* Operations Over Time Chart */}
                                    <Grid item xs={12} md={8}>
                                        <Typography variant="subtitle1" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                            Operations Over Time
                                        </Typography>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                height: '100%',
                                                borderRadius: 2,
                                                backgroundColor: paperBgColor,
                                                border: `1px solid ${borderColor}`,
                                            }}
                                        >
                                            <ResponsiveContainer width="100%" height={300}>
                                                <LineChart data={operationsChartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                                                    <XAxis
                                                        dataKey="date"
                                                        tickFormatter={(date) => format(new Date(date), 'MMM d')}
                                                        tick={{ fill: secondaryTextColor }}
                                                    />
                                                    <YAxis yAxisId="left" tick={{ fill: secondaryTextColor }} />
                                                    <YAxis yAxisId="right" orientation="right" tick={{ fill: secondaryTextColor }} />
                                                    <RechartsTooltip
                                                        formatter={(value, name) => [
                                                            name === 'operations' ? value : `$${value.toFixed(2)}`,
                                                            name === 'operations' ? 'Operations' : 'Cost'
                                                        ]}
                                                        labelFormatter={(label) => format(new Date(label), 'MMMM d, yyyy')}
                                                    />
                                                    <Line
                                                        yAxisId="left"
                                                        type="monotone"
                                                        dataKey="operations"
                                                        stroke={isDarkMode ? '#58a6ff' : '#0366d6'}
                                                        activeDot={{ r: 8 }}
                                                        name="operations"
                                                    />
                                                    <Line
                                                        yAxisId="right"
                                                        type="monotone"
                                                        dataKey="cost"
                                                        stroke={isDarkMode ? '#f0b429' : '#e3b341'}
                                                        name="cost"
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </Paper>
                                    </Grid>

                                    {/* Success Rate Pie Chart */}
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="subtitle1" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                            Success Rate
                                        </Typography>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                height: '100%',
                                                borderRadius: 2,
                                                backgroundColor: paperBgColor,
                                                border: `1px solid ${borderColor}`,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <ResponsiveContainer width="100%" height={300}>
                                                <PieChart>
                                                    <Pie
                                                        data={successRateData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={70}
                                                        outerRadius={90}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    >
                                                        {successRateData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip formatter={(value, name) => [`${value} operations`, name]} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Paper>
                                    </Grid>

                                    {/* Cost Analysis */}
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                            Cost Analysis
                                        </Typography>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: 2,
                                                backgroundColor: paperBgColor,
                                                border: `1px solid ${borderColor}`,
                                            }}
                                        >
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={4}>
                                                    <Box sx={{ p: 2, borderRadius: 1, backgroundColor: isDarkMode ? 'rgba(46, 164, 79, 0.1)' : 'rgba(46, 164, 79, 0.05)' }}>
                                                        <Typography variant="body2" fontWeight="500" sx={{ color: isDarkMode ? '#7ee787' : '#2ea44f', mb: 1 }}>
                                                            Most Efficient Day
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor, mb: 1 }}>
                                                            Wednesday
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                            Average cost: $0.62 per operation
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <Box sx={{ p: 2, borderRadius: 1, backgroundColor: isDarkMode ? 'rgba(240, 180, 41, 0.1)' : 'rgba(227, 179, 65, 0.05)' }}>
                                                        <Typography variant="body2" fontWeight="500" sx={{ color: isDarkMode ? '#f0b429' : '#e3b341', mb: 1 }}>
                                                            Average Monthly Cost
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor, mb: 1 }}>
                                                            $8.73
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                            Based on the last 3 months
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <Box sx={{ p: 2, borderRadius: 1, backgroundColor: isDarkMode ? 'rgba(56, 139, 253, 0.1)' : 'rgba(3, 102, 214, 0.05)' }}>
                                                        <Typography variant="body2" fontWeight="500" sx={{ color: isDarkMode ? '#58a6ff' : '#0366d6', mb: 1 }}>
                                                            Projected Annual Cost
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor, mb: 1 }}>
                                                            $104.80
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                            Based on current usage patterns
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Settings Tab */}
                        {tabValue === 2 && (
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={3}>
                                    {/* Budget Settings */}
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                            Budget Settings
                                        </Typography>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: 2,
                                                backgroundColor: paperBgColor,
                                                border: `1px solid ${borderColor}`,
                                                mb: 3,
                                            }}
                                        >
                                            <FormControlLabel
                                                control={<Switch defaultChecked color="primary" />}
                                                label={
                                                    <Box>
                                                        <Typography sx={{ color: primaryTextColor }}>
                                                            Daily Operation Limit
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                            Limit this agent to 10 operations per day
                                                        </Typography>
                                                    </Box>
                                                }
                                                sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}
                                            />

                                            <FormControlLabel
                                                control={<Switch defaultChecked color="primary" />}
                                                label={
                                                    <Box>
                                                        <Typography sx={{ color: primaryTextColor }}>
                                                            Monthly Budget Cap
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                            Deactivate when monthly cost exceeds $15
                                                        </Typography>
                                                    </Box>
                                                }
                                                sx={{ display: 'flex', alignItems: 'flex-start' }}
                                            />
                                        </Paper>
                                    </Grid>

                                    {/* Notification Settings */}
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                            Notification Settings
                                        </Typography>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: 2,
                                                backgroundColor: paperBgColor,
                                                border: `1px solid ${borderColor}`,
                                                mb: 3,
                                            }}
                                        >
                                            <FormControlLabel
                                                control={<Switch defaultChecked color="primary" />}
                                                label={
                                                    <Box>
                                                        <Typography sx={{ color: primaryTextColor }}>
                                                            Email Notifications
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                            Receive emails when operations complete or fail
                                                        </Typography>
                                                    </Box>
                                                }
                                                sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}
                                            />

                                            <FormControlLabel
                                                control={<Switch defaultChecked color="primary" />}
                                                label={
                                                    <Box>
                                                        <Typography sx={{ color: primaryTextColor }}>
                                                            Cost Alerts
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                            Get notified when costs reach 80% of your monthly budget
                                                        </Typography>
                                                    </Box>
                                                }
                                                sx={{ display: 'flex', alignItems: 'flex-start' }}
                                            />
                                        </Paper>
                                    </Grid>

                                    {/* Prompt Template */}
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="subtitle1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                Prompt Template
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<ContentCopyIcon />}
                                                onClick={copyPromptTemplate}
                                                sx={{
                                                    borderColor: borderColor,
                                                    color: secondaryTextColor,
                                                    '&:hover': {
                                                        borderColor: primaryColor,
                                                    },
                                                    textTransform: 'none',
                                                }}
                                            >
                                                Copy
                                            </Button>
                                        </Box>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: 2,
                                                backgroundColor: isDarkMode ? 'rgba(13,17,23,0.6)' : 'rgba(246,248,250,0.6)',
                                                border: `1px solid ${borderColor}`,
                                                fontFamily: 'monospace',
                                                whiteSpace: 'pre-wrap',
                                                color: primaryTextColor,
                                            }}
                                        >
                                            {agent.promptTemplate}
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Container>

            {/* Delete Agent Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteDialogClose}
                PaperProps={{
                    sx: {
                        backgroundColor: paperBgColor,
                        color: primaryTextColor,
                        borderRadius: 2,
                    }
                }}
            >
                <DialogTitle>Delete Agent</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: secondaryTextColor }}>
                        Are you sure you want to delete this agent? This action cannot be undone.
                        All operation history and data associated with this agent will be permanently deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleDeleteDialogClose}
                        sx={{ color: secondaryTextColor, textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteDialogClose}
                        sx={{
                            backgroundColor: isDarkMode ? '#f85149' : '#d73a49',
                            '&:hover': {
                                backgroundColor: isDarkMode ? '#da3633' : '#cb2431',
                            },
                            textTransform: 'none',
                        }}
                    >
                        Delete Agent
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Operation Details Dialog */}
            {selectedOperation && (
                <Dialog
                    open={operationDetailsOpen}
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
                                    Operation Type
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Avatar
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            backgroundColor: selectedOperation.type === 'PR Review' ?
                                                (isDarkMode ? 'rgba(240, 81, 35, 0.15)' : 'rgba(240, 81, 35, 0.1)') :
                                                (isDarkMode ? 'rgba(121, 83, 210, 0.15)' : 'rgba(121, 83, 210, 0.1)'),
                                            mr: 1
                                        }}
                                    >
                                        {selectedOperation.type === 'PR Review' ?
                                            <CodeIcon fontSize="small" sx={{ color: isDarkMode ? '#f0723e' : '#e34c26' }} /> :
                                            <BugReportIcon fontSize="small" sx={{ color: isDarkMode ? '#a78ddc' : '#6f42c1' }} />
                                        }
                                    </Avatar>
                                    <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                        {selectedOperation.type}
                                    </Typography>
                                </Box>

                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                    Target
                                </Typography>
                                <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor, mb: 3 }}>
                                    <a href={selectedOperation.targetLink} style={{ textDecoration: 'none', color: primaryColor }} target="_blank" rel="noreferrer">
                                        {selectedOperation.targetItem}
                                    </a>
                                </Typography>

                                {selectedOperation.type === 'PR Review' && (
                                    <>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                            Branches
                                        </Typography>
                                        <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor, mb: 3 }}>
                                            {selectedOperation.branchFrom} → {selectedOperation.branchTo}
                                        </Typography>

                                        <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                            Files Changed
                                        </Typography>
                                        <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor, mb: 3 }}>
                                            {selectedOperation.filesChanged}
                                        </Typography>
                                    </>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                    Date & Time
                                </Typography>
                                <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor, mb: 3 }}>
                                    {format(new Date(selectedOperation.date), 'MMMM d, yyyy, h:mm a')}
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
                                        maxHeight: 300,
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
                            variant="outlined"
                            startIcon={<UploadFileIcon />}
                            sx={{
                                borderColor: borderColor,
                                color: secondaryTextColor,
                                textTransform: 'none',
                                mr: 1,
                            }}
                        >
                            Post to GitHub
                        </Button>
                        <Button
                            onClick={closeOperationDetails}
                            variant="contained"
                            sx={{
                                backgroundColor: primaryColor,
                                textTransform: 'none',
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </MainLayout>
    );
}

export default AgentDetail;
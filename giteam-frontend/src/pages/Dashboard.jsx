import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    Card,
    CardContent,
    Divider,
    useTheme,
    useMediaQuery,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    AppBar,
    Toolbar,
    Chip,
    Avatar,
    Badge,
    LinearProgress,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import FolderIcon from '@mui/icons-material/Folder';
import PaidIcon from '@mui/icons-material/Paid';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { getUserInfo, logout } from '../services/auth';

function Dashboard() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isDarkMode = theme.palette.mode === 'dark';
    const [drawerOpen, setDrawerOpen] = useState(!isMobile);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserInfo();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const primaryColor = theme.palette.primary.main;
    const bgColor = isDarkMode ? '#0d1117' : '#f6f8fa';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';

    const drawerWidth = 240;

    // Sample repositories with their agents
    const repositories = [
        {
            name: 'giteams',
            link: 'https://github.com/FelipeCarillo/giteam-frontend',
            agents: [
                {
                    name: 'PRBuddy',
                    function: 'PR Review',
                    model: 'GPT-4',
                    active: true,
                    branches: ['main', 'develop'],
                    costMonth: 8.75
                }
            ]
        },
        {
            name: 'chat-question-awnser',
            link: 'https://github.com/FelipeCarillo/chat-question-awnser',
            agents: [
                {
                    name: 'IssueGenius',
                    function: 'Issue Resolution',
                    model: 'Claude 3',
                    active: true,
                    costMonth: 12.30
                },
                {
                    name: 'CodeReviewer',
                    function: 'PR Review',
                    model: 'Llama 3',
                    active: false,
                    branches: ['main'],
                    costMonth: 5.20
                }
            ]
        },
        {
            name: 'apaeleilao_backend',
            link: 'https://github.com/FelipeCarillo/apaeleilao_backend',
            agents: [
                {
                    name: 'DocHelper',
                    function: 'Both',
                    model: 'GPT-3.5',
                    active: true,
                    branches: ['main'],
                    costMonth: 3.45
                }
            ]
        },
    ];

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon /> },
        { text: 'My Agents', icon: <SmartToyOutlinedIcon /> },
        { text: 'Repositories', icon: <FolderIcon /> },
        { text: 'Operation History', icon: <HistoryIcon /> },
        { text: 'Costs', icon: <PaidIcon /> },
        { text: 'Settings', icon: <SettingsIcon /> },
    ];

    // Sample agent creation options
    const agentOptions = [
        {
            title: 'PR Review Agent',
            description: 'Create an agent to review pull requests',
            icon: <CodeIcon fontSize="large" sx={{ color: primaryColor }} />,
            function: 'PR Review'
        },
        {
            title: 'Issue Resolution Agent',
            description: 'Create an agent to help resolve issues',
            icon: <BugReportIcon fontSize="large" sx={{ color: primaryColor }} />,
            function: 'Issue Resolution'
        },
        {
            title: 'Full-Service Agent',
            description: 'Create an agent that handles both PRs and issues',
            icon: <SmartToyOutlinedIcon fontSize="large" sx={{ color: primaryColor }} />,
            function: 'Both'
        },
    ];

    // Sample recent agent operations
    const recentOperations = [
        {
            agentName: 'PRBuddy',
            repository: 'frontend',
            action: 'PR Review completed',
            details: 'PR #42: Add authentication flow',
            time: '2 hours ago',
            cost: 0.85,
            icon: <CodeIcon sx={{ color: primaryColor }} />
        },
        {
            agentName: 'IssueGenius',
            repository: 'backend-api',
            action: 'Issue resolved',
            details: 'Issue #78: API rate limiting not working correctly',
            time: 'Yesterday',
            cost: 1.25,
            icon: <BugReportIcon sx={{ color: primaryColor }} />
        },
        {
            agentName: 'DocHelper',
            repository: 'documentation',
            action: 'PR Review completed',
            details: 'PR #15: Update installation guide',
            time: '3 days ago',
            cost: 0.35,
            icon: <CodeIcon sx={{ color: primaryColor }} />
        },
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: bgColor,
            }}
        >
            {/* Sidebar */}
            <Drawer
                variant={isMobile ? 'temporary' : 'persistent'}
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: isDarkMode ? '#161b22' : '#fff',
                        borderRight: `1px solid ${borderColor}`,
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SmartToyOutlinedIcon
                            sx={{
                                fontSize: 24,
                                mr: 1,
                                color: primaryColor
                            }}
                        />
                        <Typography variant="h6" fontWeight="bold" sx={{ color: primaryTextColor }}>
                            GiTeams
                        </Typography>
                    </Box>
                    {isMobile && (
                        <IconButton onClick={toggleDrawer}>
                            <ChevronRightIcon />
                        </IconButton>
                    )}
                </Box>
                <Divider sx={{ borderColor }} />
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem button key={item.text} sx={{
                            '&:hover': {
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
                            }
                        }}>
                            <ListItemIcon sx={{ color: index === 0 ? primaryColor : secondaryTextColor, minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    color: index === 0 ? primaryTextColor : secondaryTextColor,
                                    fontWeight: index === 0 ? 500 : 400
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ borderColor }} />
                <Box sx={{ mt: 'auto', p: 2 }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={logout}
                        startIcon={<LogoutIcon />}
                        sx={{
                            borderColor: borderColor,
                            color: secondaryTextColor,
                            '&:hover': {
                                borderColor: primaryColor,
                                backgroundColor: isDarkMode ? 'rgba(46, 164, 79, 0.1)' : 'rgba(46, 164, 79, 0.05)',
                            },
                            textTransform: 'none',
                        }}
                    >
                        Sign out
                    </Button>
                </Box>
            </Drawer>

            {/* Main content */}
            <Box sx={{ flexGrow: 1 }}>
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        backgroundColor: paperBgColor,
                        borderBottom: `1px solid ${borderColor}`,
                        color: primaryTextColor,
                    }}
                >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer}
                            sx={{ mr: 2, display: isMobile ? 'block' : 'none' }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
                            Dashboard
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <GitHubIcon sx={{ mr: 1, color: secondaryTextColor }} />
                            <Typography variant="body2" color={secondaryTextColor}>
                                {user ? user.login : 'Loading...'}
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
                    {/* Active Agents Summary */}
                    <Box sx={{ mb: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
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
                                        <SmartToyOutlinedIcon sx={{ mr: 1, color: primaryColor }} />
                                        <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                            Active Agents
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                        4
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                        Across 3 repositories
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
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
                                        <PaidIcon sx={{ mr: 1, color: primaryColor }} />
                                        <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                            This Month's Cost
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                        $29.70
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                        Operation costs from all agents
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
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
                                        <HistoryIcon sx={{ mr: 1, color: primaryColor }} />
                                        <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                            Operations This Week
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                        28
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                        PR Reviews: 18 | Issue Resolutions: 10
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Create New Agent Card */}
                    <Card
                        elevation={0}
                        sx={{
                            mb: 4,
                            backgroundColor: paperBgColor,
                            border: `1px solid ${borderColor}`,
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                p: { xs: 3, md: 4 },
                                borderBottom: `1px solid ${borderColor}`,
                                backgroundImage: 'linear-gradient(to right, rgba(46, 164, 79, 0.05), rgba(0, 102, 204, 0.05))'
                            }}
                        >
                            <Typography variant="h5" fontWeight="500" gutterBottom sx={{ color: primaryTextColor }}>
                                Create a New Agent
                            </Typography>
                            <Typography variant="body2" sx={{ color: secondaryTextColor, maxWidth: 800 }}>
                                Set up AI-powered agents to help with your GitHub workflow. Configure agents to review PRs, resolve issues, or both.
                            </Typography>
                        </Box>
                        <Box sx={{ p: { xs: 3, md: 4 } }}>
                            <Grid container spacing={3}>
                                {agentOptions.map((option) => (
                                    <Grid item xs={12} sm={4} key={option.title}>
                                        <Button
                                            fullWidth
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                textAlign: 'left',
                                                p: 2,
                                                height: '100%',
                                                border: `1px solid ${borderColor}`,
                                                borderRadius: 1,
                                                backgroundColor: 'transparent',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                },
                                            }}
                                        >
                                            {option.icon}
                                            <Typography variant="subtitle1" fontWeight="500" sx={{ mt: 2, color: primaryTextColor }}>
                                                {option.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                {option.description}
                                            </Typography>
                                            <Chip
                                                label={option.function}
                                                size="small"
                                                sx={{
                                                    mt: 2,
                                                    backgroundColor: isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)',
                                                    color: isDarkMode ? '#7ee787' : '#2ea44f'
                                                }}
                                            />
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Card>

                    {/* Repositories and Agents Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight="500" gutterBottom sx={{ color: primaryTextColor, mb: 2 }}>
                            Your Repositories & Agents
                        </Typography>
                        <Grid container spacing={3}>
                            {repositories.map((repo) => (
                                <Grid item xs={12} key={repo.name}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            borderRadius: 2,
                                            backgroundColor: paperBgColor,
                                            border: `1px solid ${borderColor}`,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Box sx={{ p: 3, borderBottom: `1px solid ${borderColor}` }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <FolderIcon sx={{ mr: 1, color: primaryColor }} />
                                                    <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                        <a href={repo.link} style={{ textDecoration: 'none', color: primaryTextColor }} target="_blank" rel="noreferrer">
                                                            {repo.name}
                                                        </a>
                                                    </Typography>
                                                </Box>
                                                {repo.agents.length < 2 && repo.agents.every(a => a.function !== 'Both') && (
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<AddCircleOutlineIcon />}
                                                        size="small"
                                                        sx={{
                                                            borderColor: borderColor,
                                                            color: secondaryTextColor,
                                                            '&:hover': {
                                                                borderColor: primaryColor,
                                                            },
                                                            textTransform: 'none',
                                                        }}
                                                    >
                                                        Add Agent
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                        {repo.agents.map((agent, agentIndex) => (
                                            <Box key={agent.name} sx={{ p: 3, ...(agentIndex > 0 && { borderTop: `1px dashed ${borderColor}` }) }}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={5}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar
                                                                sx={{
                                                                    width: 40,
                                                                    height: 40,
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
                                                            <Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Typography variant="subtitle1" fontWeight="500" sx={{ color: primaryTextColor, mr: 1 }}>
                                                                        {agent.name}
                                                                    </Typography>
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
                                                                </Box>
                                                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                                    Function: {agent.function} | Model: {agent.model}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        {agent.function.includes('PR') && (
                                                            <Box>
                                                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                                                    Monitoring branches:
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                                    {agent.branches && agent.branches.map(branch => (
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
                                                        )}
                                                        {!agent.function.includes('PR') && (
                                                            <Box>
                                                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                                                    Issue resolution metrics:
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                    <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                                        Success rate:
                                                                    </Typography>
                                                                    <Box sx={{ flexGrow: 1, position: 'relative' }}>
                                                                        <LinearProgress
                                                                            variant="determinate"
                                                                            value={85}
                                                                            sx={{
                                                                                height: 8,
                                                                                borderRadius: 1,
                                                                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                                                                '& .MuiLinearProgress-bar': {
                                                                                    backgroundColor: isDarkMode ? '#7ee787' : '#2ea44f'
                                                                                }
                                                                            }}
                                                                        />
                                                                        <Typography
                                                                            variant="caption"
                                                                            sx={{
                                                                                position: 'absolute',
                                                                                right: 0,
                                                                                top: '8px',
                                                                                color: isDarkMode ? '#7ee787' : '#2ea44f'
                                                                            }}
                                                                        >
                                                                            85%
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                        )}
                                                    </Grid>
                                                    <Grid item xs={12} md={3}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, height: '100%', alignItems: 'center' }}>
                                                            <Box>
                                                                <Typography variant="body2" sx={{ color: secondaryTextColor, textAlign: 'right' }}>
                                                                    Cost this month:
                                                                </Typography>
                                                                <Typography variant="subtitle1" fontWeight="500" sx={{ color: primaryTextColor, textAlign: 'right' }}>
                                                                    ${agent.costMonth.toFixed(2)}
                                                                </Typography>
                                                            </Box>
                                                            <IconButton
                                                                size="small"
                                                                sx={{
                                                                    color: agent.active ?
                                                                        (isDarkMode ? '#ff7b72' : '#d73a49') :
                                                                        (isDarkMode ? '#7ee787' : '#2ea44f'),
                                                                    border: `1px solid ${borderColor}`,
                                                                    marginLeft: 1
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
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        ))}
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Recent Operations */}
                    <Box>
                        <Typography variant="h6" fontWeight="500" gutterBottom sx={{ color: primaryTextColor, mb: 2 }}>
                            Recent Agent Operations
                        </Typography>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                backgroundColor: paperBgColor,
                                border: `1px solid ${borderColor}`,
                                overflow: 'hidden',
                            }}
                        >
                            {recentOperations.map((operation, index) => (
                                <Box key={index}>
                                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                                        <Avatar
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                backgroundColor: isDarkMode ? 'rgba(56, 139, 253, 0.15)' : 'rgba(3, 102, 214, 0.1)',
                                                color: isDarkMode ? '#58a6ff' : '#0366d6',
                                                mr: 2
                                            }}
                                        >
                                            {operation.icon}
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="body2" fontWeight="500" sx={{ color: primaryTextColor, mr: 1 }}>
                                                    {operation.agentName}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                    in {operation.repository}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                                {operation.action}: {operation.details}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                                <Typography variant="caption" sx={{ color: secondaryTextColor }}>
                                                    {operation.time}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: secondaryTextColor }}>
                                                    Cost: ${operation.cost.toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    {index < recentOperations.length - 1 && <Divider sx={{ borderColor }} />}
                                </Box>
                            ))}
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="text"
                                    sx={{
                                        color: primaryColor,
                                        textTransform: 'none',
                                    }}
                                >
                                    View All Operations
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}

export default Dashboard;
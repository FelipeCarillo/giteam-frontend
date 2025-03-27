import React, { useState } from 'react';
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
    Tabs,
    Tab,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Tooltip,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import PersonIcon from '@mui/icons-material/Person';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import PaidIcon from '@mui/icons-material/Paid';
import ApiIcon from '@mui/icons-material/Api';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import ShieldIcon from '@mui/icons-material/Shield';
import SyncIcon from '@mui/icons-material/Sync';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import WarningIcon from '@mui/icons-material/Warning';
import MainLayout from '../layouts/MainLayout';

function Settings() {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [tabValue, setTabValue] = useState(0);
    const [syncGithubDialogOpen, setSyncGithubDialogOpen] = useState(false);
    const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
    const [resetApiKeyDialogOpen, setResetApiKeyDialogOpen] = useState(false);
    
    const primaryColor = theme.palette.primary.main;
    const bgColor = isDarkMode ? '#0d1117' : '#f6f8fa';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';

    // Sample user data
    const userData = {
        name: 'Felipe Carillo',
        email: 'felipe@example.com',
        githubUsername: 'FelipeCarillo',
        avatarUrl: 'https://github.com/identicons/app/assets/FelipeCarillo',
        createdAt: '2024-11-15',
        plan: 'Pro',
        currentBillingPeriod: 'March 1, 2025 - March 31, 2025',
        apiKey: 'gt_7f4b632e8a5c49b3ab9d1c8f5e6b7a9d',
        costSettings: {
            monthlyBudget: 100,
            alertThreshold: 80,
            autoDisableAgents: true,
        },
        notificationSettings: {
            email: true,
            browser: true,
            githubComments: true,
            costAlerts: true,
            operationReports: true,
            weeklyDigest: true,
        },
        defaultAgentSettings: {
            defaultPRModel: 'GPT-4',
            defaultIssueModel: 'Claude 3',
            reviewStyle: 'detailed',
            commentStyle: 'inline',
        },
        securitySettings: {
            twoFactorEnabled: true,
            sessionTimeout: 120, // minutes
            autoLogout: true,
            ipRestriction: false,
        },
        connectedModels: [
            { id: 1, name: 'OpenAI', status: 'connected', models: ['GPT-4', 'GPT-3.5'], keyLastUpdated: '2025-02-15' },
            { id: 2, name: 'Anthropic', status: 'connected', models: ['Claude 3'], keyLastUpdated: '2025-01-30' },
            { id: 3, name: 'Meta', status: 'connected', models: ['Llama 3'], keyLastUpdated: '2025-03-10' },
            { id: 4, name: 'Mistral', status: 'not_connected', models: [], keyLastUpdated: null },
        ],
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Handle copy API key
    const handleCopyApiKey = () => {
        navigator.clipboard.writeText(userData.apiKey);
    };

    // Handle toggling of notification settings
    const handleNotificationSettingChange = (setting) => (event) => {
        // In a real application, this would update the state and make an API call
        console.log(`Changed ${setting} to ${event.target.checked}`);
    };

    // Handle security settings changes
    const handleSecuritySettingChange = (setting) => (event) => {
        // In a real application, this would update the state and make an API call
        console.log(`Changed ${setting} to ${event.target.checked}`);
    };

    // Handle cost settings changes
    const handleCostSettingChange = (setting, value) => {
        // In a real application, this would update the state and make an API call
        console.log(`Changed ${setting} to ${value}`);
    };

    // Dialog handlers
    const handleSyncGithubDialogOpen = () => {
        setSyncGithubDialogOpen(true);
    };

    const handleSyncGithubDialogClose = () => {
        setSyncGithubDialogOpen(false);
    };

    const handleDeleteAccountDialogOpen = () => {
        setDeleteAccountDialogOpen(true);
    };

    const handleDeleteAccountDialogClose = () => {
        setDeleteAccountDialogOpen(false);
    };

    const handleResetApiKeyDialogOpen = () => {
        setResetApiKeyDialogOpen(true);
    };

    const handleResetApiKeyDialogClose = () => {
        setResetApiKeyDialogOpen(false);
    };

    // Get the current tab content
    const getTabContent = () => {
        switch (tabValue) {
            case 0: // Account
                return (
                    <Box>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                GitHub Integration
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
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ bgcolor: '#24292e', mr: 2 }}>
                                            <GitHubIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                GitHub Account: {userData.githubUsername}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Connected since {userData.createdAt}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        startIcon={<SyncIcon />}
                                        onClick={handleSyncGithubDialogOpen}
                                        sx={{
                                            borderColor: borderColor,
                                            color: secondaryTextColor,
                                            '&:hover': {
                                                borderColor: primaryColor,
                                            },
                                            textTransform: 'none',
                                        }}
                                    >
                                        Sync GitHub Data
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                Personal Information
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
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            variant="outlined"
                                            defaultValue={userData.name}
                                            sx={{
                                                mb: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: borderColor,
                                                    },
                                                },
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            variant="outlined"
                                            defaultValue={userData.email}
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
                                        <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                            Subscription Plan
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Chip
                                                label={userData.plan}
                                                color="primary"
                                                sx={{
                                                    mr: 1,
                                                    backgroundColor: isDarkMode ? '#238636' : '#2ea44f',
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Current billing period: {userData.currentBillingPeriod}
                                            </Typography>
                                        </Box>
                                        
                                        <Button
                                            variant="outlined"
                                            startIcon={<PaymentIcon />}
                                            sx={{
                                                borderColor: borderColor,
                                                color: secondaryTextColor,
                                                '&:hover': {
                                                    borderColor: primaryColor,
                                                },
                                                textTransform: 'none',
                                                mb: 1,
                                            }}
                                        >
                                            Manage Subscription
                                        </Button>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            Manage your subscription plan, billing info, and payment methods.
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: primaryColor,
                                            '&:hover': {
                                                backgroundColor: isDarkMode ? '#3fb950' : '#2c974b',
                                            },
                                            textTransform: 'none',
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                API Access
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
                                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 2 }}>
                                    Use this API key to access GiTeams programmatically. Keep it secure and never share it.
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        value={userData.apiKey}
                                        InputProps={{
                                            readOnly: true,
                                            startAdornment: (
                                                <Box sx={{ mr: 1, color: secondaryTextColor }}>
                                                    <ApiIcon />
                                                </Box>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: borderColor,
                                                },
                                                fontFamily: 'monospace',
                                            },
                                        }}
                                    />
                                    <IconButton
                                        onClick={handleCopyApiKey}
                                        sx={{ ml: 1, color: secondaryTextColor, border: `1px solid ${borderColor}` }}
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleResetApiKeyDialogOpen}
                                        sx={{
                                            borderColor: isDarkMode ? '#f85149' : '#d73a49',
                                            color: isDarkMode ? '#f85149' : '#d73a49',
                                            '&:hover': {
                                                borderColor: isDarkMode ? '#ff7b72' : '#e85c4a',
                                                backgroundColor: isDarkMode ? 'rgba(248,81,73,0.1)' : 'rgba(215,58,73,0.1)',
                                            },
                                            textTransform: 'none',
                                        }}
                                    >
                                        Reset API Key
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<IntegrationInstructionsIcon />}
                                        sx={{
                                            borderColor: borderColor,
                                            color: secondaryTextColor,
                                            '&:hover': {
                                                borderColor: primaryColor,
                                            },
                                            textTransform: 'none',
                                        }}
                                    >
                                        View API Documentation
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>

                        <Box>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                Danger Zone
                            </Typography>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    backgroundColor: isDarkMode ? 'rgba(248,81,73,0.1)' : 'rgba(248,81,73,0.05)',
                                    border: `1px solid ${isDarkMode ? '#f8514970' : '#d73a4970'}`,
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="body1" fontWeight="500" sx={{ color: isDarkMode ? '#ff7b72' : '#d73a49', display: 'flex', alignItems: 'center' }}>
                                            <WarningIcon sx={{ mr: 1 }} /> Delete Account
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor, mt: 0.5 }}>
                                            Permanently delete your account and all associated data. This action cannot be undone.
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleDeleteAccountDialogOpen}
                                        sx={{
                                            borderColor: isDarkMode ? '#f85149' : '#d73a49',
                                            color: isDarkMode ? '#f85149' : '#d73a49',
                                            '&:hover': {
                                                borderColor: isDarkMode ? '#ff7b72' : '#e85c4a',
                                                backgroundColor: isDarkMode ? 'rgba(248,81,73,0.2)' : 'rgba(215,58,73,0.1)',
                                            },
                                            textTransform: 'none',
                                        }}
                                    >
                                        Delete Account
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                );
                
            case 1: // Security
                return (
                    <Box>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                Authentication Settings
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
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={userData.securitySettings.twoFactorEnabled}
                                            onChange={handleSecuritySettingChange('twoFactorEnabled')}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                Two-Factor Authentication
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Requires a verification code in addition to your password when signing in.
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}
                                />
                                
                                <Divider sx={{ borderColor, my: 2 }} />
                                
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={userData.securitySettings.autoLogout}
                                            onChange={handleSecuritySettingChange('autoLogout')}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                Automatic Logout
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Automatically log out after a period of inactivity.
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}
                                />
                                
                                <Box sx={{ ml: 4, mb: 3 }}>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                        Session Timeout (minutes)
                                    </Typography>
                                    <FormControl
                                        variant="outlined"
                                        size="small"
                                        sx={{ width: 120 }}
                                    >
                                        <Select
                                            value={userData.securitySettings.sessionTimeout}
                                            onChange={(e) => console.log(`Changed timeout to ${e.target.value}`)}
                                            sx={{
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: borderColor,
                                                },
                                            }}
                                        >
                                            <MenuItem value={30}>30</MenuItem>
                                            <MenuItem value={60}>60</MenuItem>
                                            <MenuItem value={120}>120</MenuItem>
                                            <MenuItem value={240}>240</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                
                                <Divider sx={{ borderColor, my: 2 }} />
                                
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={userData.securitySettings.ipRestriction}
                                            onChange={handleSecuritySettingChange('ipRestriction')}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                IP Restriction
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Restrict access to specific IP addresses or ranges.
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ display: 'flex', alignItems: 'flex-start' }}
                                />
                            </Paper>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                Password
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
                                        <TextField
                                            fullWidth
                                            label="Current Password"
                                            type="password"
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: borderColor,
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="New Password"
                                            type="password"
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: borderColor,
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Confirm New Password"
                                            type="password"
                                            variant="outlined"
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
                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: primaryColor,
                                            '&:hover': {
                                                backgroundColor: isDarkMode ? '#3fb950' : '#2c974b',
                                            },
                                            textTransform: 'none',
                                        }}
                                    >
                                        Update Password
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>

                        <Box>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                Active Sessions
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
                                <List>
                                    <ListItem
                                        sx={{
                                            borderBottom: `1px solid ${borderColor}`,
                                            py: 2,
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: primaryColor }}>
                                                <ShieldIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography sx={{ color: primaryTextColor, fontWeight: 500 }}>
                                                        Current Session
                                                    </Typography>
                                                    <Chip
                                                        label="Active"
                                                        size="small"
                                                        sx={{
                                                            ml: 1,
                                                            backgroundColor: isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)',
                                                            color: isDarkMode ? '#7ee787' : '#2ea44f',
                                                        }}
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                    Chrome on Windows • IP: 192.168.1.1 • Last activity: Just now
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                    <ListItem
                                        sx={{
                                            borderBottom: `1px solid ${borderColor}`,
                                            py: 2,
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: secondaryTextColor }}>
                                                <ShieldIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography sx={{ color: primaryTextColor, fontWeight: 500 }}>
                                                    Mobile App
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                    iPhone • IP: 192.168.1.2 • Last activity: 3 hours ago
                                                </Typography>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="error"
                                                sx={{
                                                    borderColor: isDarkMode ? '#f85149' : '#d73a49',
                                                    color: isDarkMode ? '#f85149' : '#d73a49',
                                                    textTransform: 'none',
                                                }}
                                            >
                                                Revoke
                                            </Button>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <ListItem
                                        sx={{
                                            py: 2,
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: secondaryTextColor }}>
                                                <ShieldIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography sx={{ color: primaryTextColor, fontWeight: 500 }}>
                                                    Firefox
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                    macOS • IP: 192.168.1.3 • Last activity: Yesterday
                                                </Typography>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="error"
                                                sx={{
                                                    borderColor: isDarkMode ? '#f85149' : '#d73a49',
                                                    color: isDarkMode ? '#f85149' : '#d73a49',
                                                    textTransform: 'none',
                                                }}
                                            >
                                                Revoke
                                            </Button>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </List>
                                <Box sx={{ p: 2, borderTop: `1px solid ${borderColor}` }}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        sx={{
                                            borderColor: isDarkMode ? '#f85149' : '#d73a49',
                                            color: isDarkMode ? '#f85149' : '#d73a49',
                                            '&:hover': {
                                                borderColor: isDarkMode ? '#ff7b72' : '#e85c4a',
                                                backgroundColor: isDarkMode ? 'rgba(248,81,73,0.1)' : 'rgba(215,58,73,0.1)',
                                            },
                                            textTransform: 'none',
                                        }}
                                    >
                                        Revoke All Other Sessions
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                );
                
            case 2: // Notifications
                return (
                    <Box>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                Notification Channels
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
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={userData.notificationSettings.email}
                                            onChange={handleNotificationSettingChange('email')}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                Email Notifications
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Receive notifications via email at {userData.email}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}
                                />
                                
                                <Divider sx={{ borderColor, my: 2 }} />
                                
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={userData.notificationSettings.browser}
                                            onChange={handleNotificationSettingChange('browser')}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                Browser Notifications
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Receive notifications in your browser when you're logged in
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}
                                />
                                
                                <Divider sx={{ borderColor, my: 2 }} />
                                
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={userData.notificationSettings.githubComments}
                                            onChange={handleNotificationSettingChange('githubComments')}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                GitHub Comments
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Post agent results directly as GitHub comments on PRs and issues
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ display: 'flex', alignItems: 'flex-start' }}
                                />
                            </Paper>
                        </Box>

                        <Box>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                Notification Types
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
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={userData.notificationSettings.costAlerts}
                                            onChange={handleNotificationSettingChange('costAlerts')}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                Cost Alerts
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Receive alerts when cost approaches your defined thresholds
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}
                                />
                                
                                <Divider sx={{ borderColor, my: 2 }} />
                                
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={userData.notificationSettings.operationReports}
                                            onChange={handleNotificationSettingChange('operationReports')}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                Operation Reports
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Receive notifications when agents complete an operation
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}
                                />
                                
                                <Divider sx={{ borderColor, my: 2 }} />
                                
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={userData.notificationSettings.weeklyDigest}
                                            onChange={handleNotificationSettingChange('weeklyDigest')}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                Weekly Digest
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Receive a weekly summary of agent operations and costs
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ display: 'flex', alignItems: 'flex-start' }}
                                />
                            </Paper>
                        </Box>
                    </Box>
                );
                
            case 3: // Agent Defaults
                return (
                    <Box>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                Default Models
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
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                                Default Model for PR Reviews
                                            </Typography>
                                            <FormControl
                                                fullWidth
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: borderColor,
                                                        },
                                                    },
                                                }}
                                            >
                                                <Select
                                                    value={userData.defaultAgentSettings.defaultPRModel}
                                                    onChange={(e) => console.log(`Changed to ${e.target.value}`)}
                                                >
                                                    <MenuItem value="GPT-4">GPT-4</MenuItem>
                                                    <MenuItem value="GPT-3.5">GPT-3.5</MenuItem>
                                                    <MenuItem value="Claude 3">Claude 3</MenuItem>
                                                    <MenuItem value="Llama 3">Llama 3</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor, mt: 1 }}>
                                                This model will be used by default for new PR review agents.
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                                Default Model for Issue Resolution
                                            </Typography>
                                            <FormControl
                                                fullWidth
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: borderColor,
                                                        },
                                                    },
                                                }}
                                            >
                                                <Select
                                                    value={userData.defaultAgentSettings.defaultIssueModel}
                                                    onChange={(e) => console.log(`Changed to ${e.target.value}`)}
                                                >
                                                    <MenuItem value="GPT-4">GPT-4</MenuItem>
                                                    <MenuItem value="GPT-3.5">GPT-3.5</MenuItem>
                                                    <MenuItem value="Claude 3">Claude 3</MenuItem>
                                                    <MenuItem value="Llama 3">Llama 3</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor, mt: 1 }}>
                                                This model will be used by default for new issue resolution agents.
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                Review Style Settings
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
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                                PR Review Detail Level
                                            </Typography>
                                            <FormControl
                                                fullWidth
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: borderColor,
                                                        },
                                                    },
                                                }}
                                            >
                                                <Select
                                                    value={userData.defaultAgentSettings.reviewStyle}
                                                    onChange={(e) => console.log(`Changed to ${e.target.value}`)}
                                                >
                                                    <MenuItem value="brief">Brief (Focus on critical issues only)</MenuItem>
                                                    <MenuItem value="standard">Standard (Cover issues and some suggestions)</MenuItem>
                                                    <MenuItem value="detailed">Detailed (Comprehensive review and suggestions)</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor, mt: 1 }}>
                                                This setting affects the thoroughness of PR reviews.
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                                Comment Style
                                            </Typography>
                                            <FormControl
                                                fullWidth
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: borderColor,
                                                        },
                                                    },
                                                }}
                                            >
                                                <Select
                                                    value={userData.defaultAgentSettings.commentStyle}
                                                    onChange={(e) => console.log(`Changed to ${e.target.value}`)}
                                                >
                                                    <MenuItem value="inline">Inline (Comment on specific lines)</MenuItem>
                                                    <MenuItem value="summary">Summary (Single comment with all findings)</MenuItem>
                                                    <MenuItem value="both">Both (Inline comments and summary)</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor, mt: 1 }}>
                                                This setting determines how comments are posted on GitHub.
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>

                        <Box>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                Connected LLM Providers
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
                                <List>
                                    {userData.connectedModels.map((provider) => (
                                        <ListItem
                                            key={provider.id}
                                            sx={{
                                                borderBottom: `1px solid ${borderColor}`,
                                                py: 2,
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: provider.status === 'connected' ? primaryColor : secondaryTextColor }}>
                                                    <SmartToyOutlinedIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Typography sx={{ color: primaryTextColor, fontWeight: 500 }}>
                                                            {provider.name}
                                                        </Typography>
                                                        <Chip
                                                            label={provider.status === 'connected' ? 'Connected' : 'Not Connected'}
                                                            size="small"
                                                            sx={{
                                                                ml: 1,
                                                                backgroundColor: provider.status === 'connected' ?
                                                                    (isDarkMode ? 'rgba(46, 164, 79, 0.2)' : 'rgba(46, 164, 79, 0.1)') :
                                                                    (isDarkMode ? 'rgba(215, 58, 73, 0.2)' : 'rgba(215, 58, 73, 0.1)'),
                                                                color: provider.status === 'connected' ?
                                                                    (isDarkMode ? '#7ee787' : '#2ea44f') :
                                                                    (isDarkMode ? '#ff7b72' : '#d73a49'),
                                                            }}
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                        {provider.status === 'connected' ? (
                                                            <>
                                                                Available models: {provider.models.join(', ')} • 
                                                                Key last updated: {provider.keyLastUpdated}
                                                            </>
                                                        ) : (
                                                            'Connect to use models from this provider'
                                                        )}
                                                    </Typography>
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={provider.status === 'connected' ? <EditIcon /> : <AddIcon />}
                                                    sx={{
                                                        borderColor: borderColor,
                                                        color: provider.status === 'connected' ? secondaryTextColor : primaryColor,
                                                        textTransform: 'none',
                                                    }}
                                                >
                                                    {provider.status === 'connected' ? 'Update Key' : 'Connect'}
                                                </Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                                <Box sx={{ p: 2, borderTop: `1px solid ${borderColor}` }}>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                        Connect to LLM providers to use their models with your agents. You'll need to provide API keys for each provider.
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                );
                
            case 4: // Cost Settings
                return (
                    <Box>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                Budget and Alerts
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
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                        Monthly Budget (USD)
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <TextField
                                            type="number"
                                            value={userData.costSettings.monthlyBudget}
                                            onChange={(e) => handleCostSettingChange('monthlyBudget', parseFloat(e.target.value))}
                                            InputProps={{
                                                startAdornment: (
                                                    <Box sx={{ mr: 1, color: secondaryTextColor }}>
                                                        $
                                                    </Box>
                                                ),
                                            }}
                                            sx={{
                                                width: 150,
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: borderColor,
                                                    },
                                                },
                                            }}
                                        />
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            Set a monthly budget to control your spending
                                        </Typography>
                                    </Box>
                                </Box>
                                
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                        Alert Threshold (%)
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <TextField
                                            type="number"
                                            value={userData.costSettings.alertThreshold}
                                            onChange={(e) => handleCostSettingChange('alertThreshold', parseFloat(e.target.value))}
                                            InputProps={{
                                                endAdornment: (
                                                    <Box sx={{ ml: 1, color: secondaryTextColor }}>
                                                        %
                                                    </Box>
                                                ),
                                            }}
                                            sx={{
                                                width: 150,
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: borderColor,
                                                    },
                                                },
                                            }}
                                        />
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            Receive an alert when spending reaches this percentage of your budget
                                        </Typography>
                                    </Box>
                                </Box>
                                
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={userData.costSettings.autoDisableAgents}
                                            onChange={(e) => handleCostSettingChange('autoDisableAgents', e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                Auto-Disable Agents
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Automatically disable agents when your budget is reached
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ display: 'flex', alignItems: 'flex-start' }}
                                />
                            </Paper>
                        </Box>

                        <Box>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                Cost Optimization
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
                                <Alert
                                    icon={<LightbulbIcon sx={{ color: isDarkMode ? '#f0b429' : '#e3b341' }} />}
                                    severity="info"
                                    sx={{
                                        mb: 3,
                                        backgroundColor: isDarkMode ? 'rgba(240, 180, 41, 0.1)' : 'rgba(227, 179, 65, 0.1)',
                                        color: primaryTextColor,
                                        border: `1px solid ${isDarkMode ? 'rgba(240, 180, 41, 0.3)' : 'rgba(227, 179, 65, 0.3)'}`,
                                        '& .MuiAlert-icon': {
                                            alignItems: 'center',
                                        },
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                        Based on your usage patterns, we recommend switching your PR Review agents to GPT-3.5 
                                        for simpler repositories to save approximately $28.50 per month.
                                    </Typography>
                                </Alert>
                                
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ p: 2, borderRadius: 1, backgroundColor: isDarkMode ? 'rgba(46, 164, 79, 0.1)' : 'rgba(46, 164, 79, 0.05)' }}>
                                            <Typography variant="body2" fontWeight="500" sx={{ color: isDarkMode ? '#7ee787' : '#2ea44f', mb: 1 }}>
                                                Token Usage Efficiency
                                            </Typography>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor, mb: 1 }}>
                                                87%
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Your prompts are relatively efficient compared to similar users
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ p: 2, borderRadius: 1, backgroundColor: isDarkMode ? 'rgba(56, 139, 253, 0.1)' : 'rgba(3, 102, 214, 0.05)' }}>
                                            <Typography variant="body2" fontWeight="500" sx={{ color: isDarkMode ? '#58a6ff' : '#0366d6', mb: 1 }}>
                                                Cost per Operation
                                            </Typography>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor, mb: 1 }}>
                                                $0.68
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Average cost per agent operation
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ p: 2, borderRadius: 1, backgroundColor: isDarkMode ? 'rgba(240, 180, 41, 0.1)' : 'rgba(227, 179, 65, 0.05)' }}>
                                            <Typography variant="body2" fontWeight="500" sx={{ color: isDarkMode ? '#f0b429' : '#e3b341', mb: 1 }}>
                                                Projected Monthly Cost
                                            </Typography>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor, mb: 1 }}>
                                                $42.50
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Based on current usage patterns
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    </Box>
                );
                
            case 5: // Appearance
                return (
                    <Box>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                Theme Settings
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
                                        <Box
                                            sx={{
                                                p: 3,
                                                borderRadius: 2,
                                                border: `2px solid ${isDarkMode ? primaryColor : borderColor}`,
                                                backgroundColor: '#0d1117',
                                                mb: 1,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography sx={{ color: '#f0f6fc', fontWeight: 500 }}>
                                                    Dark Mode
                                                </Typography>
                                                <DarkModeIcon sx={{ color: '#58a6ff' }} />
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor, textAlign: 'center' }}>
                                            Dark
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box
                                            sx={{
                                                p: 3,
                                                borderRadius: 2,
                                                border: `2px solid ${!isDarkMode ? primaryColor : borderColor}`,
                                                backgroundColor: '#ffffff',
                                                mb: 1,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography sx={{ color: '#24292e', fontWeight: 500 }}>
                                                    Light Mode
                                                </Typography>
                                                <LightModeIcon sx={{ color: '#0366d6' }} />
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor, textAlign: 'center' }}>
                                            Light
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box
                                            sx={{
                                                p: 3,
                                                borderRadius: 2,
                                                border: `2px solid ${borderColor}`,
                                                backgroundImage: 'linear-gradient(to right, #ffffff, #0d1117)',
                                                mb: 1,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography sx={{ color: '#24292e', fontWeight: 500 }}>
                                                    Auto
                                                </Typography>
                                                <SettingsIcon sx={{ color: '#6e7781' }} />
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor, textAlign: 'center' }}>
                                            System
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>

                        <Box>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                Interface Preferences
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
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={true}
                                            onChange={() => {}}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                Compact View
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Reduce padding and spacing throughout the interface
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}
                                />
                                
                                <Divider sx={{ borderColor, my: 2 }} />
                                
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={false}
                                            onChange={() => {}}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: primaryTextColor }}>
                                                Animations
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                Enable animations and transitions in the interface
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}
                                />
                                
                                <Divider sx={{ borderColor, my: 2 }} />
                                
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1 }}>
                                        Default Page
                                    </Typography>
                                    <FormControl
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: borderColor,
                                                },
                                            },
                                        }}
                                    >
                                        <Select
                                            value="dashboard"
                                            onChange={() => {}}
                                        >
                                            <MenuItem value="dashboard">Dashboard</MenuItem>
                                            <MenuItem value="myAgents">My Agents</MenuItem>
                                            <MenuItem value="repositories">Repositories</MenuItem>
                                            <MenuItem value="history">Operation History</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor, mt: 1 }}>
                                        Choose which page to show first when you log in
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <MainLayout title="Settings">
            <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                backgroundColor: paperBgColor,
                                border: `1px solid ${borderColor}`,
                                position: 'sticky',
                                top: 24,
                            }}
                        >
                            <List>
                                <ListItem
                                    button
                                    selected={tabValue === 0}
                                    onClick={() => setTabValue(0)}
                                    sx={{
                                        borderRadius: '8px 8px 0 0',
                                        '&.Mui-selected': {
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                            color: primaryColor,
                                        },
                                        '&:hover': {
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                        },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: tabValue === 0 ? primaryColor : secondaryTextColor }}>
                                            <AccountBoxIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Account"
                                        secondary="Profile and API keys"
                                        primaryTypographyProps={{
                                            color: tabValue === 0 ? primaryColor : primaryTextColor,
                                            fontWeight: tabValue === 0 ? 500 : 400,
                                        }}
                                        secondaryTypographyProps={{
                                            color: secondaryTextColor,
                                        }}
                                    />
                                </ListItem>
                                <Divider sx={{ borderColor }} />
                                <ListItem
                                    button
                                    selected={tabValue === 1}
                                    onClick={() => setTabValue(1)}
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                            color: primaryColor,
                                        },
                                        '&:hover': {
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                        },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: tabValue === 1 ? primaryColor : secondaryTextColor }}>
                                            <SecurityIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Security"
                                        secondary="Password and 2FA"
                                        primaryTypographyProps={{
                                            color: tabValue === 1 ? primaryColor : primaryTextColor,
                                            fontWeight: tabValue === 1 ? 500 : 400,
                                        }}
                                        secondaryTypographyProps={{
                                            color: secondaryTextColor,
                                        }}
                                    />
                                </ListItem>
                                <Divider sx={{ borderColor }} />
                                <ListItem
                                    button
                                    selected={tabValue === 2}
                                    onClick={() => setTabValue(2)}
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                            color: primaryColor,
                                        },
                                        '&:hover': {
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                        },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: tabValue === 2 ? primaryColor : secondaryTextColor }}>
                                            <NotificationsIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Notifications"
                                        secondary="Email and alerts"
                                        primaryTypographyProps={{
                                            color: tabValue === 2 ? primaryColor : primaryTextColor,
                                            fontWeight: tabValue === 2 ? 500 : 400,
                                        }}
                                        secondaryTypographyProps={{
                                            color: secondaryTextColor,
                                        }}
                                    />
                                </ListItem>
                                <Divider sx={{ borderColor }} />
                                <ListItem
                                    button
                                    selected={tabValue === 3}
                                    onClick={() => setTabValue(3)}
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                            color: primaryColor,
                                        },
                                        '&:hover': {
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                        },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: tabValue === 3 ? primaryColor : secondaryTextColor }}>
                                            <SmartToyOutlinedIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Agent Defaults"
                                        secondary="Models and LLM providers"
                                        primaryTypographyProps={{
                                            color: tabValue === 3 ? primaryColor : primaryTextColor,
                                            fontWeight: tabValue === 3 ? 500 : 400,
                                        }}
                                        secondaryTypographyProps={{
                                            color: secondaryTextColor,
                                        }}
                                    />
                                </ListItem>
                                <Divider sx={{ borderColor }} />
                                <ListItem
                                    button
                                    selected={tabValue === 4}
                                    onClick={() => setTabValue(4)}
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                            color: primaryColor,
                                        },
                                        '&:hover': {
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                        },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: tabValue === 4 ? primaryColor : secondaryTextColor }}>
                                            <PaidIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Cost Settings"
                                        secondary="Budget and alerts"
                                        primaryTypographyProps={{
                                            color: tabValue === 4 ? primaryColor : primaryTextColor,
                                            fontWeight: tabValue === 4 ? 500 : 400,
                                        }}
                                        secondaryTypographyProps={{
                                            color: secondaryTextColor,
                                        }}
                                    />
                                </ListItem>
                                <Divider sx={{ borderColor }} />
                                <ListItem
                                    button
                                    selected={tabValue === 5}
                                    onClick={() => setTabValue(5)}
                                    sx={{
                                        borderRadius: '0 0 8px 8px',
                                        '&.Mui-selected': {
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                            color: primaryColor,
                                        },
                                        '&:hover': {
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                        },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: tabValue === 5 ? primaryColor : secondaryTextColor }}>
                                            <SettingsIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Appearance"
                                        secondary="Theme and layout"
                                        primaryTypographyProps={{
                                            color: tabValue === 5 ? primaryColor : primaryTextColor,
                                            fontWeight: tabValue === 5 ? 500 : 400,
                                        }}
                                        secondaryTypographyProps={{
                                            color: secondaryTextColor,
                                        }}
                                    />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        {getTabContent()}
                    </Grid>
                </Grid>
            </Container>

            {/* Dialogs */}
            <Dialog
                open={syncGithubDialogOpen}
                onClose={handleSyncGithubDialogClose}
                PaperProps={{
                    sx: {
                        backgroundColor: paperBgColor,
                        color: primaryTextColor,
                        borderRadius: 2,
                    }
                }}
            >
                <DialogTitle>Sync GitHub Data</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: secondaryTextColor }}>
                        This will sync the latest repository data from your GitHub account. Any new repositories 
                        will be added to GiTeams. This process may take a few moments.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button 
                        onClick={handleSyncGithubDialogClose}
                        sx={{ color: secondaryTextColor, textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained"
                        startIcon={<SyncIcon />}
                        onClick={handleSyncGithubDialogClose}
                        sx={{
                            backgroundColor: primaryColor,
                            '&:hover': {
                                backgroundColor: isDarkMode ? '#3fb950' : '#2c974b',
                            },
                            textTransform: 'none',
                        }}
                    >
                        Sync Now
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteAccountDialogOpen}
                onClose={handleDeleteAccountDialogClose}
                PaperProps={{
                    sx: {
                        backgroundColor: paperBgColor,
                        color: primaryTextColor,
                        borderRadius: 2,
                    }
                }}
            >
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: secondaryTextColor, mb: 2 }}>
                        This action cannot be undone. It will permanently delete your account, all your agents,
                        and all associated data. Your GitHub repositories will not be affected.
                    </DialogContentText>
                    <DialogContentText sx={{ color: isDarkMode ? '#ff7b72' : '#d73a49', fontWeight: 500 }}>
                        Please type "delete" to confirm:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: borderColor,
                                },
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button 
                        onClick={handleDeleteAccountDialogClose}
                        sx={{ color: secondaryTextColor, textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained"
                        color="error"
                        onClick={handleDeleteAccountDialogClose}
                        sx={{
                            backgroundColor: isDarkMode ? '#f85149' : '#d73a49',
                            '&:hover': {
                                backgroundColor: isDarkMode ? '#da3633' : '#cb2431',
                            },
                            textTransform: 'none',
                        }}
                    >
                        Delete Account
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={resetApiKeyDialogOpen}
                onClose={handleResetApiKeyDialogClose}
                PaperProps={{
                    sx: {
                        backgroundColor: paperBgColor,
                        color: primaryTextColor,
                        borderRadius: 2,
                    }
                }}
            >
                <DialogTitle>Reset API Key</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: secondaryTextColor }}>
                        This will invalidate your current API key and generate a new one. Any applications or 
                        scripts using the current key will stop working. Are you sure you want to continue?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button 
                        onClick={handleResetApiKeyDialogClose}
                        sx={{ color: secondaryTextColor, textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained"
                        color="error"
                        onClick={handleResetApiKeyDialogClose}
                        sx={{
                            backgroundColor: isDarkMode ? '#f85149' : '#d73a49',
                            '&:hover': {
                                backgroundColor: isDarkMode ? '#da3633' : '#cb2431',
                            },
                            textTransform: 'none',
                        }}
                    >
                        Reset Key
                    </Button>
                </DialogActions>
            </Dialog>
        </MainLayout>
    );
}

export default Settings;
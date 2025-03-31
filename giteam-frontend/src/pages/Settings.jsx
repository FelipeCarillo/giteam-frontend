// pages/Settings.js
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    Switch,
    FormControlLabel,
    Divider,
    Slider,
    InputAdornment,
    IconButton,
    useTheme,
    Alert,
    Snackbar
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaidIcon from '@mui/icons-material/Paid';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import GitHubIcon from '@mui/icons-material/GitHub';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Layout from '../components/layout/Layout';
import { userSettings } from '../services/mockData';

const Settings = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const [settings, setSettings] = useState(userSettings);
    const [showApiKey, setShowApiKey] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';

    const handleNotificationChange = (event) => {
        setSettings({
            ...settings,
            notifications: {
                ...settings.notifications,
                [event.target.name]: event.target.checked
            }
        });
    };

    const handleIntegrationChange = (event) => {
        setSettings({
            ...settings,
            integrations: {
                ...settings.integrations,
                [event.target.name]: event.target.checked
            }
        });
    };

    const handleSliderChange = (name) => (event, newValue) => {
        setSettings({
            ...settings,
            costLimits: {
                ...settings.costLimits,
                [name]: newValue
            }
        });
    };

    const handleApiKeyChange = (event) => {
        setSettings({
            ...settings,
            apiKey: event.target.value
        });
    };

    const handleSaveSettings = () => {
        // In a real app, this would save the settings to a backend
        setSnackbarMessage('Settings saved successfully!');
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const toggleShowApiKey = () => {
        setShowApiKey(!showApiKey);
    };

    return (
        <Layout title="Settings">
            <Grid container spacing={4}>
                {/* Profile Settings */}
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 2,
                            backgroundColor: paperBgColor,
                            border: `1px solid ${borderColor}`,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <SettingsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                Profile Settings
                            </Typography>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    value={settings.username}
                                    disabled
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <GitHubIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={settings.email}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="API Key"
                                    type={showApiKey ? 'text' : 'password'}
                                    value={settings.apiKey}
                                    onChange={handleApiKeyChange}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VpnKeyIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle api key visibility"
                                                    onClick={toggleShowApiKey}
                                                    edge="end"
                                                >
                                                    {showApiKey ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Typography variant="caption" sx={{ color: secondaryTextColor, display: 'block', mt: 1 }}>
                                    Your GitHub API key is used to authenticate with the GitHub API.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Notification Settings */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 2,
                            backgroundColor: paperBgColor,
                            border: `1px solid ${borderColor}`,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <NotificationsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                Notification Settings
                            </Typography>
                        </Box>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.notifications.email}
                                    onChange={handleNotificationChange}
                                    name="email"
                                    color="primary"
                                />
                            }
                            label="Email Notifications"
                            sx={{ color: primaryTextColor, display: 'block', mb: 1 }}
                        />
                        <Typography variant="caption" sx={{ color: secondaryTextColor, display: 'block', mb: 2, ml: 4 }}>
                            Receive email notifications for important events.
                        </Typography>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.notifications.slack}
                                    onChange={handleNotificationChange}
                                    name="slack"
                                    color="primary"
                                />
                            }
                            label="Slack Notifications"
                            sx={{ color: primaryTextColor, display: 'block', mb: 1 }}
                        />
                        <Typography variant="caption" sx={{ color: secondaryTextColor, display: 'block', mb: 2, ml: 4 }}>
                            Receive Slack notifications for important events.
                        </Typography>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.notifications.highCostAlerts}
                                    onChange={handleNotificationChange}
                                    name="highCostAlerts"
                                    color="primary"
                                />
                            }
                            label="High Cost Alerts"
                            sx={{ color: primaryTextColor, display: 'block', mb: 1 }}
                        />
                        <Typography variant="caption" sx={{ color: secondaryTextColor, display: 'block', mb: 2, ml: 4 }}>
                            Receive alerts when your usage cost exceeds thresholds.
                        </Typography>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.notifications.weeklyReports}
                                    onChange={handleNotificationChange}
                                    name="weeklyReports"
                                    color="primary"
                                />
                            }
                            label="Weekly Reports"
                            sx={{ color: primaryTextColor, display: 'block', mb: 1 }}
                        />
                        <Typography variant="caption" sx={{ color: secondaryTextColor, display: 'block', mb: 2, ml: 4 }}>
                            Receive weekly summary reports of your agents' activities.
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    {/* Cost Limits */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 2,
                            backgroundColor: paperBgColor,
                            border: `1px solid ${borderColor}`,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <PaidIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                Cost Limits
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                    Daily Spending Limit
                                </Typography>
                                <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                    ${settings.costLimits.dailyLimit}
                                </Typography>
                            </Box>
                            <Slider
                                value={settings.costLimits.dailyLimit}
                                onChange={handleSliderChange('dailyLimit')}
                                min={1}
                                max={20}
                                step={1}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(value) => `$${value}`}
                            />
                            <Typography variant="caption" sx={{ color: secondaryTextColor, display: 'block', mt: 1 }}>
                                Agents will stop running when your daily spending reaches this limit.
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                    Monthly Spending Limit
                                </Typography>
                                <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                    ${settings.costLimits.monthlyLimit}
                                </Typography>
                            </Box>
                            <Slider
                                value={settings.costLimits.monthlyLimit}
                                onChange={handleSliderChange('monthlyLimit')}
                                min={10}
                                max={200}
                                step={10}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(value) => `$${value}`}
                            />
                            <Typography variant="caption" sx={{ color: secondaryTextColor, display: 'block', mt: 1 }}>
                                Agents will stop running when your monthly spending reaches this limit.
                            </Typography>
                        </Box>

                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                    Alert Threshold (% of limit)
                                </Typography>
                                <Typography variant="body2" sx={{ color: primaryTextColor }}>
                                    {settings.costLimits.alertThreshold}%
                                </Typography>
                            </Box>
                            <Slider
                                value={settings.costLimits.alertThreshold}
                                onChange={handleSliderChange('alertThreshold')}
                                min={50}
                                max={95}
                                step={5}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(value) => `${value}%`}
                            />
                            <Typography variant="caption" sx={{ color: secondaryTextColor, display: 'block', mt: 1 }}>
                                You'll receive an alert when your spending reaches this percentage of your limit.
                            </Typography>
                        </Box>
                    </Paper>

                    {/* Integrations */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 2,
                            backgroundColor: paperBgColor,
                            border: `1px solid ${borderColor}`,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <IntegrationInstructionsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                Integrations
                            </Typography>
                        </Box>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.integrations.github}
                                    onChange={handleIntegrationChange}
                                    name="github"
                                    color="primary"
                                    disabled
                                />
                            }
                            label="GitHub"
                            sx={{ color: primaryTextColor, display: 'block', mb: 1 }}
                        />
                        <Typography variant="caption" sx={{ color: secondaryTextColor, display: 'block', mb: 2, ml: 4 }}>
                            Connected to GitHub as {settings.username}
                        </Typography>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.integrations.slack}
                                    onChange={handleIntegrationChange}
                                    name="slack"
                                    color="primary"
                                />
                            }
                            label="Slack"
                            sx={{ color: primaryTextColor, display: 'block', mb: 1 }}
                        />
                        <Typography variant="caption" sx={{ color: secondaryTextColor, display: 'block', mb: 2, ml: 4 }}>
                            Connect to Slack for notifications and agent reports.
                        </Typography>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.integrations.discord}
                                    onChange={handleIntegrationChange}
                                    name="discord"
                                    color="primary"
                                />
                            }
                            label="Discord"
                            sx={{ color: primaryTextColor, display: 'block', mb: 1 }}
                        />
                        <Typography variant="caption" sx={{ color: secondaryTextColor, display: 'block', mb: 2, ml: 4 }}>
                            Connect to Discord for notifications and agent reports.
                        </Typography>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.integrations.jira}
                                    onChange={handleIntegrationChange}
                                    name="jira"
                                    color="primary"
                                />
                            }
                            label="Jira"
                            sx={{ color: primaryTextColor, display: 'block', mb: 1 }}
                        />
                        <Typography variant="caption" sx={{ color: secondaryTextColor, display: 'block', mb: 2, ml: 4 }}>
                            Connect to Jira for issue tracking integration.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Save Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSaveSettings}
                    sx={{ textTransform: 'none' }}
                >
                    Save Settings
                </Button>
            </Box>

            {/* Snackbar for notifications */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Layout>
    );
};

export default Settings;
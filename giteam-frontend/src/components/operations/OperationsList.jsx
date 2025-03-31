// components/operations/OperationsList.jsx
import React from 'react';
import { Box, Paper, Typography, Divider, Button, Avatar, useTheme } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';

const OperationsList = ({ operations, showViewAll = true, maxItems = null, onViewAll = () => { } }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const primaryColor = theme.palette.primary.main;
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';

    // Limit operations list based on maxItems
    const displayedOperations = maxItems ? operations.slice(0, maxItems) : operations;

    const getIconComponent = (iconName) => {
        switch (iconName) {
            case 'CodeIcon':
                return <CodeIcon sx={{ color: primaryColor }} />;
            case 'BugReportIcon':
                return <BugReportIcon sx={{ color: primaryColor }} />;
            default:
                return <CodeIcon sx={{ color: primaryColor }} />;
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 2,
                backgroundColor: paperBgColor,
                border: `1px solid ${borderColor}`,
                overflow: 'hidden',
            }}
        >
            {displayedOperations.map((operation, index) => (
                <React.Fragment key={operation.id}>
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
                            {getIconComponent(operation.icon)}
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
                    {index < displayedOperations.length - 1 && <Divider sx={{ borderColor }} />}
                </React.Fragment>
            ))}

            {showViewAll && (
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="text"
                        onClick={onViewAll}
                        sx={{
                            color: primaryColor,
                            textTransform: 'none',
                        }}
                    >
                        View All Operations
                    </Button>
                </Box>
            )}
        </Paper>
    );
};

export default OperationsList;
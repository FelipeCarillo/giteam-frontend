// pages/OperationHistory.js
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    InputAdornment,
    Pagination,
    useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Layout from '../components/layout/Layout';
import OperationsList from '../components/operations/OperationsList';
import { operations } from '../services/mockData';
import { useLanguage } from '../contexts/LanguageContext';

const ITEMS_PER_PAGE = 5;

const OperationHistory = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const { t } = useLanguage();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterAgent, setFilterAgent] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [page, setPage] = useState(1);

    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';

    // Get unique agent names for filter dropdown
    const uniqueAgents = [...new Set(operations.map(op => op.agentName))];

    // Filter operations based on search and filters
    const filteredOperations = operations.filter(operation => {
        // Filter by agent
        if (filterAgent !== 'all' && operation.agentName !== filterAgent) return false;

        // Filter by operation type
        if (filterType !== 'all') {
            if (filterType === 'PR' && !operation.action.includes('PR')) return false;
            if (filterType === 'Issue' && !operation.action.includes('Issue')) return false;
        }

        // Search in details or repository
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            return (
                operation.details.toLowerCase().includes(searchLower) ||
                operation.repository.toLowerCase().includes(searchLower)
            );
        }

        return true;
    });

    // Pagination
    const totalPages = Math.ceil(filteredOperations.length / ITEMS_PER_PAGE);
    const paginatedOperations = filteredOperations.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // Calculate total cost of filtered operations
    const totalCost = filteredOperations.reduce((sum, op) => sum + op.cost, 0);

    return (
        <Layout title={t('operationHistoryTitle')}>
            {/* Filters and Search */}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                        {t('operationHistoryAgent')}
                    </Typography>
                    <Typography variant="body1" sx={{ color: primaryTextColor }}>
                        {t('operationCost')}: <strong>${totalCost.toFixed(2)}</strong>
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder={t('operationSearch')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>{t('operationAgent')}</InputLabel>
                            <Select
                                value={filterAgent}
                                onChange={(e) => setFilterAgent(e.target.value)}
                                label={t('operationAgent')}
                            >
                                <MenuItem value="all">{t('operationAllAgents')}</MenuItem>
                                {uniqueAgents.map(agent => (
                                    <MenuItem key={agent} value={agent}>{agent}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>{t('operationType')}</InputLabel>
                            <Select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                label={t('operationType')}
                            >
                                <MenuItem value="all">{t('operationAllTypes')}</MenuItem>
                                <MenuItem value="PR">{t('prReviews', { count: '' }).replace(': ', '')}</MenuItem>
                                <MenuItem value="Issue">{t('issueResolutions', { count: '' }).replace(': ', '')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* Operations List */}
            {filteredOperations.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 2,
                        backgroundColor: paperBgColor,
                        border: `1px solid ${borderColor}`,
                    }}
                >
                    <Typography variant="body1" sx={{ color: primaryTextColor }}>
                        {t('operationSearchResults')}
                    </Typography>
                </Paper>
            ) : (
                <>
                    <OperationsList
                        operations={paginatedOperations}
                        showViewAll={false}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            )}
        </Layout>
    );
};

export default OperationHistory;
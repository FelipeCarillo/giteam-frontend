// pages/OperationHistory.js
import React, { useState, useEffect } from 'react';
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
    useTheme,
    CircularProgress,
    Alert,
    Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Layout from '../components/layout/Layout';
import OperationsList from '../components/operations/OperationsList';
import { getOperations } from '../services/operation';
import { useLanguage } from '../contexts/LanguageContext';

const ITEMS_PER_PAGE = 5;

const OperationHistory = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const { t } = useLanguage();

    // Estados para dados da API
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Estados para filtros
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAgent, setFilterAgent] = useState('all');
    const [filterRepository, setFilterRepository] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterAction, setFilterAction] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);

    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';

    // Buscar operações da API
    const fetchOperations = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);
            
            const response = await getOperations();
            setOperations(response.operations || []);
        } catch (err) {
            setError('Erro ao carregar operações: ' + err.message);
            console.error('Error fetching operations:', err);
        } finally {
            if (isRefresh) {
                setRefreshing(false);
            } else {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchOperations();
    }, []);

    // Função para refresh manual
    const handleRefresh = () => {
        fetchOperations(true);
    };

    // Extrair valores únicos para filtros
    const uniqueAgents = [...new Set(operations.map(op => op.agent?.name).filter(Boolean))];
    const uniqueRepositories = [...new Set(operations.map(op => op.repository?.name).filter(Boolean))];
    const uniqueStatuses = [...new Set(operations.map(op => op.status).filter(Boolean))];
    const uniqueActions = [...new Set(operations.map(op => op.action).filter(Boolean))];

    // Helper function para converter data
    const parseDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString);
    };

    // Filtrar operações
    const filteredOperations = operations.filter(operation => {
        // Filtro por agente
        if (filterAgent !== 'all' && operation.agent?.name !== filterAgent) {
            return false;
        }

        // Filtro por repositório
        if (filterRepository !== 'all' && operation.repository?.name !== filterRepository) {
            return false;
        }

        // Filtro por status
        if (filterStatus !== 'all' && operation.status !== filterStatus) {
            return false;
        }

        // Filtro por ação
        if (filterAction !== 'all' && operation.action !== filterAction) {
            return false;
        }

        // Filtro por data
        if (startDate || endDate) {
            const operationDate = parseDate(operation.created_at);
            if (!operationDate) return false;

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                if (operationDate < start) return false;
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                if (operationDate > end) return false;
            }
        }

        // Busca por texto
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            const agentName = operation.agent?.name || '';
            const repositoryName = operation.repository?.name || '';
            const details = operation.details || '';
            const action = operation.action || '';
            const githubRef = operation.github_reference || '';
            
            return (
                agentName.toLowerCase().includes(searchLower) ||
                repositoryName.toLowerCase().includes(searchLower) ||
                details.toLowerCase().includes(searchLower) ||
                action.toLowerCase().includes(searchLower) ||
                githubRef.toLowerCase().includes(searchLower)
            );
        }

        return true;
    });

    // Paginação
    const totalPages = Math.ceil(filteredOperations.length / ITEMS_PER_PAGE);
    const paginatedOperations = filteredOperations.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // Reset page when filters change
    const handleFilterChange = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    // Calcular custo total
    const totalCost = filteredOperations.reduce((sum, op) => sum + (op.cost || 0), 0);

    // Limpar filtros
    const clearFilters = () => {
        setSearchQuery('');
        setFilterAgent('all');
        setFilterRepository('all');
        setFilterStatus('all');
        setFilterAction('all');
        setStartDate('');
        setEndDate('');
        setPage(1);
    };

    if (loading) {
        return (
            <Layout title={t('operationHistoryTitle')}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout title={t('operationHistoryTitle')}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            </Layout>
        );
    }

    return (
        <Layout title={t('operationHistoryTitle')}>
            {/* Filtros e Busca */}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                        {t('operationHistoryAgent')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1" sx={{ color: primaryTextColor }}>
                            Custo Total: <strong>${totalCost.toFixed(2)}</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ color: primaryTextColor, opacity: 0.7 }}>
                            ({filteredOperations.length} {filteredOperations.length === 1 ? 'operação' : 'operações'})
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            sx={{ textTransform: 'none' }}
                        >
                            {refreshing ? 'Atualizando...' : 'Atualizar'}
                        </Button>
                    </Box>
                </Box>

                <Grid container spacing={2}>
                    {/* Primeira linha: Busca e Filtro de Data */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Buscar por agente, repositório, detalhes, ação ou referência..."
                            value={searchQuery}
                            onChange={(e) => handleFilterChange(setSearchQuery)(e.target.value)}
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

                    {/* Filtro de Data */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                                label="Data Início"
                                type="date"
                                value={startDate}
                                onChange={(e) => handleFilterChange(setStartDate)(e.target.value)}
                                variant="outlined"
                                size="small"
                                sx={{ flex: 1 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <Typography variant="body2" sx={{ color: primaryTextColor, px: 1 }}>
                                até
                            </Typography>
                            <TextField
                                label="Data Fim"
                                type="date"
                                value={endDate}
                                onChange={(e) => handleFilterChange(setEndDate)(e.target.value)}
                                variant="outlined"
                                size="small"
                                sx={{ flex: 1 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>
                    </Grid>

                    {/* Segunda linha: Filtros de seleção */}
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Repositório</InputLabel>
                            <Select
                                value={filterRepository}
                                onChange={(e) => handleFilterChange(setFilterRepository)(e.target.value)}
                                label="Repositório"
                            >
                                <MenuItem value="all">Todos os Repositórios</MenuItem>
                                {uniqueRepositories.map(repo => (
                                    <MenuItem key={repo} value={repo}>{repo}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Agente</InputLabel>
                            <Select
                                value={filterAgent}
                                onChange={(e) => handleFilterChange(setFilterAgent)(e.target.value)}
                                label="Agente"
                            >
                                <MenuItem value="all">Todos os Agentes</MenuItem>
                                {uniqueAgents.map(agent => (
                                    <MenuItem key={agent} value={agent}>{agent}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={filterStatus}
                                onChange={(e) => handleFilterChange(setFilterStatus)(e.target.value)}
                                label="Status"
                            >
                                <MenuItem value="all">Todos os Status</MenuItem>
                                {uniqueStatuses.map(status => (
                                    <MenuItem key={status} value={status}>
                                        {status === 'completed' ? 'Concluído' : 
                                         status === 'pending' ? 'Pendente' : 
                                         status === 'failed' ? 'Falhou' : status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Ação</InputLabel>
                            <Select
                                value={filterAction}
                                onChange={(e) => handleFilterChange(setFilterAction)(e.target.value)}
                                label="Ação"
                            >
                                <MenuItem value="all">Todas as Ações</MenuItem>
                                {uniqueActions.map(action => (
                                    <MenuItem key={action} value={action}>{action}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Botão Limpar Filtros */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.primary.main,
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    '&:hover': {
                                        opacity: 0.8
                                    }
                                }}
                                onClick={clearFilters}
                            >
                                Limpar Filtros
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Lista de Operações */}
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
                    <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2 }}>
                        {searchQuery || filterAgent !== 'all' || filterRepository !== 'all' || filterStatus !== 'all' || filterAction !== 'all' || startDate || endDate
                            ? 'Nenhuma operação encontrada com os filtros aplicados.'
                            : 'Nenhuma operação encontrada.'
                        }
                    </Typography>
                    {(searchQuery || filterAgent !== 'all' || filterRepository !== 'all' || filterStatus !== 'all' || filterAction !== 'all' || startDate || endDate) && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.primary.main,
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                '&:hover': {
                                    opacity: 0.8
                                }
                            }}
                            onClick={clearFilters}
                        >
                            Limpar todos os filtros
                        </Typography>
                    )}
                </Paper>
            ) : (
                <>
                    <OperationsList
                        operations={paginatedOperations}
                        showViewAll={false}
                    />

                    {/* Paginação */}
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
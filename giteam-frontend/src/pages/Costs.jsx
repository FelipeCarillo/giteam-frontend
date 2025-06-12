// pages/Costs.jsx
import React, { useState, useEffect } from 'react';
import { 
    Typography, 
    Paper, 
    Grid, 
    Alert,
    CircularProgress,
    Box,
    useTheme,
    FormControl,
    Select,
    MenuItem,
    InputLabel
} from '@mui/material';
import Layout from '../components/layout/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { getCosts } from '../services/cost';

const Costs = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const { t, language } = useLanguage(); // pegar language do contexto
    const locale = language || 'pt-BR';

    const [costsData, setCostsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasHistoryData, setHasHistoryData] = useState(false);
    
    const [selectedOption, setSelectedOption] = useState('');
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [selectedCostItem, setSelectedCostItem] = useState(null);
    
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';

    // Função para formatar "2025-04" em "abril de 2025" ou "April 2025" conforme locale
    const formatMonthYear = (monthString, locale) => {
        if (!monthString) return '';
        const [year, month] = monthString.split('-');
        const date = new Date(year, month - 1);
        return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
    };

    const fetchCosts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await getCosts();
            const costHistory = response.cost_history || [];
            setCostsData(costHistory);
            setHasHistoryData(costHistory.length > 0);

            // Gerar opções do dropdown com base no campo "month"
            const options = costHistory.map(item => {
                const [year, month] = item.month.split('-');
                return {
                    value: item.month,
                    label: `${month}/${year}`
                };
            }).sort((a, b) => b.value.localeCompare(a.value)); // Mais recentes primeiro

            setDropdownOptions(options);

            // Seleciona o primeiro mês disponível por padrão, se existir
            if (options.length > 0) {
                setSelectedOption(options[0].value);
                const firstItem = costHistory.find(item => item.month === options[0].value);
                setSelectedCostItem(firstItem);
            }
        } catch (err) {
            console.error('Erro ao buscar custos:', err);
            setError(err.message || 'Erro ao carregar dados de custos');
            setHasHistoryData(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCosts();
    }, []);

    const handleDropdownChange = (event) => {
        const selectedMonth = event.target.value;
        setSelectedOption(selectedMonth);

        const selectedItem = costsData.find(item => item.month === selectedMonth);
        setSelectedCostItem(selectedItem);
    };

    if (loading) {
        return (
            <Layout title={t('costs')}>
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    minHeight="200px"
                >
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    return (
        <Layout title={t('costs')}>
            {error && (
                <Alert 
                    severity="error" 
                    sx={{ mb: 3, borderRadius: 2 }}
                >
                    {error}
                </Alert>
            )}
            
            {!hasHistoryData && !error && (
                <Alert 
                    severity="info" 
                    sx={{ mb: 3, borderRadius: 2 }}
                >
                    {t('noHistoricalData')}
                </Alert>
            )}
            
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
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                            {t('currentMonthCosts')} {selectedOption && ` ${formatMonthYear(selectedOption, locale)}`}
                        </Typography>
                        <Typography variant="h3" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                            {selectedCostItem ? `$${selectedCostItem.total_cost.toFixed(2)}` : '$0.00'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                        <FormControl 
                            variant="outlined" 
                            size="small" 
                            sx={{ 
                                minWidth: 200,
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: isDarkMode ? '#21262d' : '#ffffff',
                                    '& fieldset': {
                                        borderColor: borderColor,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: isDarkMode ? '#444c56' : 'rgba(0,0,0,0.23)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.primary.main,
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: secondaryTextColor,
                                },
                                '& .MuiSelect-select': {
                                    color: primaryTextColor,
                                }
                            }}
                        >
                            <InputLabel id="costs-dropdown-label">Selecionar Período</InputLabel>
                            <Select
                                labelId="costs-dropdown-label"
                                id="costs-dropdown"
                                value={selectedOption}
                                label="Selecionar Período"
                                onChange={handleDropdownChange}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: isDarkMode ? '#21262d' : '#ffffff',
                                            border: `1px solid ${borderColor}`,
                                            '& .MuiMenuItem-root': {
                                                color: primaryTextColor,
                                                '&:hover': {
                                                    backgroundColor: isDarkMode ? '#30363d' : 'rgba(0,0,0,0.04)',
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: isDarkMode ? '#1f6feb' : 'rgba(25, 118, 210, 0.12)',
                                                    '&:hover': {
                                                        backgroundColor: isDarkMode ? '#1f6feb' : 'rgba(25, 118, 210, 0.12)',
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }}
                            >
                                {dropdownOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>
        </Layout>
    );
};

export default Costs;

// pages/Costs.js
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
    useTheme
} from '@mui/material';
import Layout from '../components/layout/Layout';
import { costHistory, getAllAgents } from '../services/mockData';
import { useLanguage } from '../contexts/LanguageContext';

const Costs = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const { t } = useLanguage();
    
    const [timeframe, setTimeframe] = useState('monthly');
    const [breakdown, setBreakdown] = useState('function');
    
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    
    // Obter todos os agentes para o detalhamento de custos
    const agents = getAllAgents();
    
    // Verificar se há dados de histórico suficientes
    const hasHistoryData = costHistory && costHistory.length > 0;
    const hasComparisonData = costHistory && costHistory.length >= 2;
    
    // Calcular o custo total do mês atual e comparação com o mês anterior
    const currentMonth = hasHistoryData ? costHistory[costHistory.length - 1] : { month: '', pr: 0, issue: 0, total: 0 };
    const currentMonthCost = currentMonth.total;
    
    // Somente calcular comparações se houver dados suficientes
    let previousMonthCost = 0;
    let costDifference = 0;
    let costPercentChange = 0;
    
    if (hasComparisonData) {
        previousMonthCost = costHistory[costHistory.length - 2].total;
        costDifference = currentMonthCost - previousMonthCost;
        costPercentChange = previousMonthCost !== 0 ? (costDifference / previousMonthCost) * 100 : 0;
    }

    // Cores para PR Review e Issue Resolution
    const prColor = isDarkMode ? '#7ee787' : '#2ea44f';
    const issueColor = isDarkMode ? '#58a6ff' : '#0366d6';

    return (
        <Layout title={t('costs')}>
            {!hasHistoryData && (
                <Alert 
                    severity="info" 
                    sx={{ 
                        mb: 3,
                        borderRadius: 2,
                    }}
                >
                    {t('noHistoricalData')}
                </Alert>
            )}
            
            {/* Cost Summary */}
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
                            {t('currentMonthCosts')}
                        </Typography>
                        <Typography variant="h3" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                            ${currentMonthCost.toFixed(2)}
                        </Typography>
                        
                        {hasComparisonData && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: costDifference >= 0 ? 
                                            prColor : 
                                            (isDarkMode ? '#ff7b72' : '#d73a49')
                                    }}
                                >
                                    {costDifference >= 0 ? '↑' : '↓'} {Math.abs(costPercentChange).toFixed(1)}% 
                                </Typography>
                                <Typography variant="body2" sx={{ color: secondaryTextColor, ml: 1 }}>
                                    {t('fromLastMonth')}
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                    
                    {hasHistoryData && (
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor, mb: 2 }}>
                                {t('breakdown')}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <Box sx={{ 
                                    p: 2, 
                                    flex: 1,
                                    borderRadius: 1,
                                    backgroundColor: isDarkMode ? 'rgba(46, 164, 79, 0.1)' : 'rgba(46, 164, 79, 0.05)',
                                    border: `1px solid ${isDarkMode ? 'rgba(46, 164, 79, 0.3)' : 'rgba(46, 164, 79, 0.2)'}`,
                                }}>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                        {t('prReviews', { count: '' })}
                                    </Typography>
                                    <Typography variant="h5" fontWeight="500" sx={{ color: prColor }}>
                                        ${currentMonth.pr.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    p: 2, 
                                    flex: 1,
                                    borderRadius: 1,
                                    backgroundColor: isDarkMode ? 'rgba(56, 139, 253, 0.1)' : 'rgba(3, 102, 214, 0.05)',
                                    border: `1px solid ${isDarkMode ? 'rgba(56, 139, 253, 0.3)' : 'rgba(3, 102, 214, 0.2)'}`,
                                }}>
                                    <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                        {t('issueResolutions', { count: '' })}
                                    </Typography>
                                    <Typography variant="h5" fontWeight="500" sx={{ color: issueColor }}>
                                        ${currentMonth.issue.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            {hasHistoryData && (
                <>
                    {/* Cost Trends */}
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                {t('costTrends')}
                            </Typography>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>{t('timeframe')}</InputLabel>
                                <Select
                                    value={timeframe}
                                    onChange={(e) => setTimeframe(e.target.value)}
                                    label={t('timeframe')}
                                >
                                    <MenuItem value="monthly">{t('monthly')}</MenuItem>
                                    <MenuItem value="weekly">{t('weekly')}</MenuItem>
                                    <MenuItem value="daily">{t('daily')}</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        
                        {/* Tabela de custos por mês */}
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: secondaryTextColor, fontWeight: 500 }}>{t('month')}</TableCell>
                                        <TableCell sx={{ color: secondaryTextColor, fontWeight: 500 }} align="right">{t('prReviews', { count: '' })}</TableCell>
                                        <TableCell sx={{ color: secondaryTextColor, fontWeight: 500 }} align="right">{t('issueResolutions', { count: '' })}</TableCell>
                                        <TableCell sx={{ color: secondaryTextColor, fontWeight: 500 }} align="right">{t('total')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {costHistory.map((month) => (
                                        <TableRow key={month.month}>
                                            <TableCell sx={{ color: primaryTextColor }}>{month.month}</TableCell>
                                            <TableCell sx={{ color: primaryTextColor }} align="right">${month.pr.toFixed(2)}</TableCell>
                                            <TableCell sx={{ color: primaryTextColor }} align="right">${month.issue.toFixed(2)}</TableCell>
                                            <TableCell sx={{ color: primaryTextColor, fontWeight: 500 }} align="right">${month.total.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Visualização com barras */}
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="subtitle2" sx={{ color: primaryTextColor, mb: 2 }}>
                                {t('monthlyCostDistribution')}
                            </Typography>
                            {costHistory.map((month) => (
                                <Box key={month.month} sx={{ mb: 3 }}>
                                    <Typography variant="body2" sx={{ color: primaryTextColor, mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{month.month}</span>
                                        <span>${month.total.toFixed(2)}</span>
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', height: 20, borderRadius: 1, overflow: 'hidden' }}>
                                        <Box sx={{ width: `${(month.pr / month.total) * 100}%`, height: '100%', bgcolor: prColor }}></Box>
                                        <Box sx={{ width: `${(month.issue / month.total) * 100}%`, height: '100%', bgcolor: issueColor }}></Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                        <Typography variant="caption" sx={{ color: prColor }}>
                                            {t('prReviews', { count: '' })}: ${month.pr.toFixed(2)} ({((month.pr / month.total) * 100).toFixed(1)}%)
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: issueColor }}>
                                            {t('issueResolutions', { count: '' })}: ${month.issue.toFixed(2)} ({((month.issue / month.total) * 100).toFixed(1)}%)
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>

                    {/* Cost Breakdown Table */}
                    {agents.length > 0 && (
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="500" sx={{ color: primaryTextColor }}>
                                    {t('costBreakdown')}
                                </Typography>
                                <FormControl size="small" sx={{ minWidth: 150 }}>
                                    <InputLabel>{t('viewBy')}</InputLabel>
                                    <Select
                                        value={breakdown}
                                        onChange={(e) => setBreakdown(e.target.value)}
                                        label={t('viewBy')}
                                    >
                                        <MenuItem value="function">{t('function')}</MenuItem>
                                        <MenuItem value="agent">{t('agent')}</MenuItem>
                                        <MenuItem value="model">{t('model')}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: secondaryTextColor, fontWeight: 500 }}>{t('name')}</TableCell>
                                            <TableCell sx={{ color: secondaryTextColor, fontWeight: 500 }}>{t('type')}</TableCell>
                                            <TableCell sx={{ color: secondaryTextColor, fontWeight: 500 }}>{t('repository')}</TableCell>
                                            <TableCell sx={{ color: secondaryTextColor, fontWeight: 500 }} align="right">{t('monthlyCost')}</TableCell>
                                            <TableCell sx={{ color: secondaryTextColor, fontWeight: 500 }} align="right">{t('percentageOfTotal')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {agents.map((agent) => (
                                            <TableRow key={agent.id}>
                                                <TableCell sx={{ color: primaryTextColor }}>{agent.name}</TableCell>
                                                <TableCell sx={{ color: secondaryTextColor }}>{agent.function}</TableCell>
                                                <TableCell sx={{ color: secondaryTextColor }}>{agent.repository}</TableCell>
                                                <TableCell sx={{ color: primaryTextColor }} align="right">${agent.costMonth.toFixed(2)}</TableCell>
                                                <TableCell sx={{ color: secondaryTextColor }} align="right">
                                                    {currentMonthCost > 0 ? ((agent.costMonth / currentMonthCost) * 100).toFixed(1) : 0}%
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}
                </>
            )}
        </Layout>
    );
};

export default Costs;
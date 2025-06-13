// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PaidIcon from '@mui/icons-material/Paid';
import HistoryIcon from '@mui/icons-material/History';

import Layout from '../components/layout/Layout';
import StatCard from '../components/dashboard/StatCard';
import AgentCreationCard from '../components/dashboard/AgentCreationCard';

import { useLanguage } from '../contexts/LanguageContext';
import { minimalAgentOptions } from '../services/mockData';
import { getRepositories } from '../services/repositories';
import { getCosts } from '../services/cost'; // Import the cost service
import { getOperations } from '../services/operation'; // Import operations service

function Dashboard() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [repositories, setRepositories] = useState([]);
    const [operations, setOperations] = useState([]);
    const [currentMonthCost, setCurrentMonthCost] = useState(0);
    const [loading, setLoading] = useState(true);

    // Função para obter o mês atual no formato YYYY-MM
    const getCurrentMonth = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };

    // Função para buscar o custo total do mês atual
    const fetchCurrentMonthCost = async () => {
        try {
            const costData = await getCosts();
            const currentMonth = getCurrentMonth();
            
            console.log('📊 Cost data received:', costData);
            console.log('📊 Current month:', currentMonth);
            
            if (costData && costData.cost_history && Array.isArray(costData.cost_history)) {
                // Procura pelo registro do mês atual
                const currentMonthData = costData.cost_history.find(
                    item => item.month === currentMonth
                );
                
                if (currentMonthData) {
                    console.log('📊 Current month cost data:', currentMonthData);
                    setCurrentMonthCost(currentMonthData.total_cost || 0);
                } else {
                    console.log('📊 No cost data found for current month, using 0');
                    setCurrentMonthCost(0);
                }
            } else {
                console.warn('📊 Invalid cost data structure:', costData);
                setCurrentMonthCost(0);
            }
        } catch (error) {
            console.error('📊 Error fetching current month cost:', error);
            setCurrentMonthCost(0);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Buscar dados dos repositórios
                const reposResponse = await getRepositories();
                
                // Buscar operações usando o service
                const opsResponse = await getOperations();
                const opsData = opsResponse?.operations || [];
                
                const reposData = reposResponse?.repositories || [];

                console.log('📊 Repositories data:', reposData);
                console.log('📊 Operations data:', opsData);

                setRepositories(Array.isArray(reposData) ? reposData : []);
                setOperations(Array.isArray(opsData) ? opsData : []);

                // Buscar custo do mês atual
                await fetchCurrentMonthCost();

            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
                setRepositories([]);
                setOperations([]);
                setCurrentMonthCost(0);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Updated function to count only active agents
    const getActiveAgentsCount = () => {
        if (!Array.isArray(repositories)) {
            return 0;
        }
        
        let totalActiveAgents = 0;
        
        repositories.forEach(repo => {
            if (Array.isArray(repo.agents)) {
                const activeAgentsInRepo = repo.agents.filter(agent => agent.active === true);
                totalActiveAgents += activeAgentsInRepo.length;
                
                // Debug logging
                console.log(`📊 Repository "${repo.name}":`, {
                    totalAgents: repo.agents.length,
                    activeAgents: activeAgentsInRepo.length,
                    agents: repo.agents.map(agent => ({ 
                        name: agent.name, 
                        active: agent.active 
                    }))
                });
            }
        });
        
        console.log('📊 Total active agents across all repositories:', totalActiveAgents);
        return totalActiveAgents;
    };

    // New function to count repositories that have active agents
    const getRepositoriesWithActiveAgentsCount = () => {
        if (!Array.isArray(repositories)) {
            return 0;
        }
        
        const reposWithActiveAgents = repositories.filter(repo => {
            if (!Array.isArray(repo.agents)) {
                return false;
            }
            
            // Check if this repository has at least one active agent
            return repo.agents.some(agent => agent.active === true);
        });
        
        console.log('📊 Repositories with active agents:', reposWithActiveAgents.length);
        return reposWithActiveAgents.length;
    };

    // Função para calcular custo estimado baseado nos agentes (mantida como fallback)
    const getEstimatedMonthlyCost = () => {
        if (!Array.isArray(repositories)) {
            return 0;
        }
        return repositories.reduce((total, repo) => {
            const costInRepo = Array.isArray(repo.agents) ? 
                repo.agents
                    .filter(agent => agent.active === true)
                    .reduce((sum, agent) => sum + (agent.costMonth || 0), 0) : 0;
            return total + costInRepo;
        }, 0);
    };

    // Função atualizada para contar operações baseada nos dados reais da API
    const getOperationsByType = () => {
        if (!Array.isArray(operations)) {
            return { 
                total: 0,
                prReviews: 0, 
                issueResolutions: 0 
            };
        }

        // Conta operações baseado no campo 'action' dos dados reais
        const prReviews = operations.filter(op => op.action === 'PR Review').length;
        const issueResolutions = operations.filter(op => op.action === 'Issue Resolution').length;
        const total = operations.length;

        console.log('📊 Operations breakdown:', {
            total,
            prReviews,
            issueResolutions,
            operations: operations.map(op => ({ 
                id: op.id, 
                action: op.action, 
                status: op.status 
            }))
        });

        return { 
            total,
            prReviews, 
            issueResolutions 
        };
    };

    if (loading) {
        return <Layout title={t('dashboard')}><Typography>{t('loading')}...</Typography></Layout>;
    }

    // Updated calculations
    const activeAgentsCount = getActiveAgentsCount();
    const reposWithActiveAgentsCount = getRepositoriesWithActiveAgentsCount();
    const totalRepoCount = Array.isArray(repositories) ? repositories.length : 0;
    const estimatedMonthlyCost = getEstimatedMonthlyCost();
    const { total, prReviews, issueResolutions } = getOperationsByType();

    // Usa o custo real do mês atual da API, ou o estimado como fallback
    const displayCost = currentMonthCost > 0 ? currentMonthCost : estimatedMonthlyCost;

    return (
        <Layout title={t('dashboard')}>
            {/* Stats */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <StatCard
                            icon={<SmartToyOutlinedIcon />}
                            title={t('activeAgents')}
                            value={activeAgentsCount}
                            subtitle={t('acrossRepositories', { count: reposWithActiveAgentsCount })}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatCard
                            icon={<PaidIcon />}
                            title={t('monthCost')}
                            value={`$${displayCost.toFixed(2)}`}
                            //subtitle={currentMonthCost > 0 ? t('actualCosts') : t('estimatedCosts')}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatCard
                            icon={<HistoryIcon />}
                            title={t('operationsThisWeek')}
                            value={total}
                            subtitle={`${prReviews} PR Reviews | ${issueResolutions} Issue Resolutions`}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Create New Agent */}
            <AgentCreationCard
                agentOptions={minimalAgentOptions}
                title={t('createNewAgent')}
                description={t('createAgentDesc')}
            />
        </Layout>
    );
}

export default Dashboard;
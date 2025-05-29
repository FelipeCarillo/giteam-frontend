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
import RepositoryCard from '../components/repository/RepositoryCard';
import OperationsList from '../components/operations/OperationsList';

import { useLanguage } from '../contexts/LanguageContext';
import { minimalAgentOptions } from '../services/mockData'; // Pode manter temporariamente até mover para API

function Dashboard() {
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    const [repositories, setRepositories] = useState([]);
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reposRes, opsRes] = await Promise.all([
                    fetch('/api/repositories'),
                    fetch('/api/operations')
                ]);

                const [reposData, opsData] = await Promise.all([
                    reposRes.json(),
                    opsRes.json()
                ]);

                // Garante que repositories e operations sejam sempre arrays
                setRepositories(Array.isArray(reposData) ? reposData : []);
                setOperations(Array.isArray(opsData) ? opsData : []);

            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
                // Em caso de erro, define como arrays vazios para evitar falhas no render
                setRepositories([]);
                setOperations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getActiveAgentsCount = () => {
        if (!Array.isArray(repositories)) {
            return 0;
        }
        return repositories.reduce((count, repo) => {
            // Adiciona verificação para repo.agents
            const activeAgentsInRepo = Array.isArray(repo.agents) ? repo.agents.filter(agent => agent.active).length : 0;
            return count + activeAgentsInRepo;
        }, 0);
    };

    const getTotalMonthlyCost = () => {
        if (!Array.isArray(repositories)) {
            return 0;
        }
        return repositories.reduce((total, repo) => {
            // Adiciona verificação para repo.agents
            const costInRepo = Array.isArray(repo.agents) ? repo.agents.reduce((sum, agent) => sum + (agent.costMonth || 0), 0) : 0;
            return total + costInRepo;
        }, 0);
    };

    const getOperationsByType = () => {
        if (!Array.isArray(operations)) {
            return { prReviews: 0, issueResolutions: 0 };
        }
        const prReviews = operations.filter(op => op.icon === 'CodeIcon').length;
        const issueResolutions = operations.filter(op => op.icon === 'BugReportIcon').length;
        return { prReviews, issueResolutions };
    };

    const handleAddAgent = (repoId) => {
        navigate('/agents/create', { state: { repositoryId: repoId } });
    };

    const handleToggleActiveAgent = (agentId) => {
        const updatedRepositories = repositories.map(repo => {
            const updatedAgents = Array.isArray(repo.agents) ? repo.agents.map(agent => {
                if (agent.id === agentId) {
                    return { ...agent, active: !agent.active };
                }
                return agent;
            }) : [];
            return { ...repo, agents: updatedAgents };
        });
        setRepositories(updatedRepositories);
    };

    const handleDeleteAgent = (agentId) => {
        const updatedRepositories = repositories.map(repo => ({
            ...repo,
            agents: Array.isArray(repo.agents) ? repo.agents.filter(agent => agent.id !== agentId) : []
        }));
        setRepositories(updatedRepositories);
    };

    const handleViewAllOperations = () => {
        navigate('/operations');
    };

    if (loading) {
        return <Layout title={t('dashboard')}><Typography>{t('loading')}...</Typography></Layout>;
    }

    // As chamadas de função agora são mais seguras
    const activeAgentsCount = getActiveAgentsCount();
    const repoCount = Array.isArray(repositories) ? repositories.length : 0;
    const monthlyCost = getTotalMonthlyCost();
    const { prReviews, issueResolutions } = getOperationsByType();
    const recentOperations = Array.isArray(operations) ? operations.slice(0, 3) : [];

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
                            subtitle={t('acrossRepositories', { count: repoCount })}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatCard
                            icon={<PaidIcon />}
                            title={t('monthCost')}
                            value={`$${monthlyCost.toFixed(2)}`}
                            subtitle={t('operationCosts')}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatCard
                            icon={<HistoryIcon />}
                            title={t('operationsThisWeek')}
                            value={Array.isArray(operations) ? operations.length : 0}
                            subtitle={`${t('prReviews', { count: prReviews })} | ${t('issueResolutions', { count: issueResolutions })}`}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Create New Agent */}
            <AgentCreationCard
                agentOptions={minimalAgentOptions} //
                title={t('createNewAgent')}
                description={t('createAgentDesc')}
            />

            {/* Repositories */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="500" gutterBottom sx={{ mb: 2 }}>
                    {t('yourRepositoriesAgents')}
                </Typography>
                {Array.isArray(repositories) && repositories.map(repo => (
                    <RepositoryCard
                        key={repo.id}
                        repository={repo}
                        onAddAgent={handleAddAgent}
                        onToggleActiveAgent={handleToggleActiveAgent}
                        onDeleteAgent={handleDeleteAgent}
                    />
                ))}
            </Box>

            {/* Recent Operations */}
            <Box>
                <Typography variant="h6" fontWeight="500" gutterBottom sx={{ mb: 2 }}>
                    {t('recentOperations')}
                </Typography>
                <OperationsList
                    key={language}
                    operations={recentOperations}
                    showViewAll={true}
                    onViewAll={handleViewAllOperations}
                />
            </Box>
        </Layout>
    );
}

export default Dashboard;
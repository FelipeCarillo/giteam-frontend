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
import { minimalAgentOptions } from '../services/mockData';
import { api } from '../services/api'; // Pode manter temporariamente até mover para API

function Dashboard() {
    const navigate = useNavigate();
    const { t, language } = useLanguage(); // Adiciona language para forçar re-render

    const [repositories, setRepositories] = useState([]);
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);

   useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Mantenha o setLoading no início
            try {
                // Use Promise.all com a instância 'api' do Axios
                const [reposRes, opsRes] = await Promise.all([
                    api.get('/api/repositories'), // <--- ALTERADO DE fetch PARA api.get
                    api.get('/api/operations')   // <--- ALTERADO DE fetch PARA api.get
                ]);

                // Com Axios, os dados já vêm em .data e são parseados
                const reposData = reposRes.data; // <--- ALTERADO
                const opsData = opsRes.data;     // <--- ALTERADO

                // Verifique se os dados recebidos são arrays antes de definir o estado
                if (Array.isArray(reposData)) {
                    setRepositories(reposData);
                } else {
                    console.error('API /api/repositories não retornou um array:', reposData);
                    setRepositories([]); // Fallback para array vazio em caso de erro de formato
                }

                if (Array.isArray(opsData)) {
                    setOperations(opsData);
                } else {
                    console.error('API /api/operations não retornou um array:', opsData);
                    setOperations([]); // Fallback para array vazio
                }

            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
                // Em caso de erro (incluindo 401), 'repositories' e 'operations'
                // manterão o estado inicial de array vazio, o que é seguro para .reduce()
                setRepositories([]);
                setOperations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getActiveAgentsCount = () => {
        if (!Array.isArray(repositories)) { // Uma verificação extra por segurança
            return 0;
        }
        return repositories.reduce((count, repo) => {
            // Adicione uma verificação para garantir que repo.agents existe e é um array
            const activeAgentsInRepo = Array.isArray(repo.agents)
                ? repo.agents.filter(agent => agent.active).length
                : 0;
            return count + activeAgentsInRepo;
        }, 0);
    };

    const getTotalMonthlyCost = () =>
        repositories.reduce((total, repo) =>
            total + repo.agents.reduce((sum, agent) => sum + agent.costMonth, 0), 0);

    const getOperationsByType = () => {
        const prReviews = operations.filter(op => op.icon === 'CodeIcon').length;
        const issueResolutions = operations.filter(op => op.icon === 'BugReportIcon').length;
        return { prReviews, issueResolutions };
    };

    const handleAddAgent = (repoId) => {
        navigate('/agents/create', { state: { repositoryId: repoId } });
    };

    const handleToggleActiveAgent = (agentId) => {
        const updatedRepositories = repositories.map(repo => {
            const updatedAgents = repo.agents.map(agent => {
                if (agent.id === agentId) {
                    return { ...agent, active: !agent.active };
                }
                return agent;
            });
            return { ...repo, agents: updatedAgents };
        });
        setRepositories(updatedRepositories);
    };

    const handleDeleteAgent = (agentId) => {
        const updatedRepositories = repositories.map(repo => ({
            ...repo,
            agents: repo.agents.filter(agent => agent.id !== agentId)
        }));
        setRepositories(updatedRepositories);
    };

    const handleViewAllOperations = () => {
        navigate('/operations');
    };

   if (loading) {
        return <Layout title={t('dashboard')}><Typography>{t('loading')}...</Typography></Layout>;
    }

    const activeAgentsCount = getActiveAgentsCount();
    const repoCount = repositories.length; // repositories será um array (vazio ou populado)
    const monthlyCost = getTotalMonthlyCost();
    const { prReviews, issueResolutions } = getOperationsByType();
    const recentOperations = operations.slice(0, 3);

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
                            value={operations.length}
                            subtitle={`${t('prReviews', { count: prReviews })} | ${t('issueResolutions', { count: issueResolutions })}`}
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

            {/* Repositories */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="500" gutterBottom sx={{ mb: 2 }}>
                    {t('yourRepositoriesAgents')}
                </Typography>
                {repositories.map(repo => (
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
                    key={language} // Força re-render quando o idioma muda
                    operations={recentOperations}
                    showViewAll={true}
                    onViewAll={handleViewAllOperations}
                />
            </Box>
        </Layout>
    );
}

export default Dashboard;
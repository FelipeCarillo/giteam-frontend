// pages/Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PaidIcon from '@mui/icons-material/Paid';
import HistoryIcon from '@mui/icons-material/History';
import { minimalAgentOptions } from '../services/mockData';

import Layout from '../components/layout/Layout';
import StatCard from '../components/dashboard/StatCard';
import AgentCreationCard from '../components/dashboard/AgentCreationCard';
import RepositoryCard from '../components/repository/RepositoryCard';
import OperationsList from '../components/operations/OperationsList';
import { useLanguage } from '../contexts/LanguageContext';

import { 
    repositories, 
    agentFunctions, 
    operations, 
    getActiveAgentsCount, 
    getRepositoriesCount, 
    getTotalMonthlyCost, 
    getOperationsByType
} from '../services/mockData';

function Dashboard() {
    const navigate = useNavigate();
    const [localRepositories, setLocalRepositories] = useState(repositories);
    const { t } = useLanguage();
    
    // Stats for the dashboard
    const activeAgentsCount = getActiveAgentsCount();
    const repoCount = getRepositoriesCount();
    const monthlyCost = getTotalMonthlyCost();
    const { prReviews, issueResolutions } = getOperationsByType();
    const recentOperations = operations.slice(0, 3); // Get only 3 most recent operations

    // Handler functions
    const handleAddAgent = (repoId) => {
        navigate('/agents/create', { state: { repositoryId: repoId } });
    };

    const handleToggleActiveAgent = (agentId) => {
        const updatedRepositories = localRepositories.map(repo => {
            const updatedAgents = repo.agents.map(agent => {
                if (agent.id === agentId) {
                    return { ...agent, active: !agent.active };
                }
                return agent;
            });
            return { ...repo, agents: updatedAgents };
        });
        setLocalRepositories(updatedRepositories);
    };

    const handleDeleteAgent = (agentId) => {
        const updatedRepositories = localRepositories.map(repo => {
            return {
                ...repo,
                agents: repo.agents.filter(agent => agent.id !== agentId)
            };
        });
        setLocalRepositories(updatedRepositories);
    };

    const handleViewAllOperations = () => {
        navigate('/operations');
    };

    return (
        <Layout title={t('dashboard')}>
            {/* Active Agents Summary */}
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

            {/* Create New Agent Card */}
            <AgentCreationCard 
                agentOptions={minimalAgentOptions} 
                title={t('createNewAgent')} 
                description={t('createAgentDesc')}
            />

            {/* Repositories and Agents Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="500" gutterBottom sx={{ mb: 2 }}>
                    {t('yourRepositoriesAgents')}
                </Typography>
                {localRepositories.map(repo => (
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
                    operations={recentOperations}
                    showViewAll={true}
                    onViewAll={handleViewAllOperations}
                    viewAllLabel={t('viewAllOperations')}
                />
            </Box>
        </Layout>
    );
}

export default Dashboard;
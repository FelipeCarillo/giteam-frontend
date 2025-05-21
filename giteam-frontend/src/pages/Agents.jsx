// pages/Agents.jsx
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    Grid, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    TextField,
    Divider,
    InputAdornment,
    useTheme 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Layout from '../components/layout/Layout';
import AgentItem from '../components/agent/AgentItem';
// Removida a importação: import { getAllAgents, agentOptions } from '../services/mockData';

const Agents = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isDarkMode = theme.palette.mode === 'dark';

    // Estado para armazenar os agentes, inicializado como array vazio em vez de usar getAllAgents()
    const [agents, setAgents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');

    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';

    // Efeito para carregar os agentes quando o componente montar
    useEffect(() => {
        // Aqui você faria uma chamada à API real para buscar os agentes
        fetchAgents();
    }, []);

    // Função para buscar agentes da API
    const fetchAgents = async () => {
        try {
            // Exemplo de chamada à API (substitua pelo seu endpoint real)
            // const response = await fetch('/api/agents');
            // const data = await response.json();
            // setAgents(data);
            
            // Temporariamente, inicializar com array vazio até implementar a API real
            setAgents([]);
        } catch (error) {
            console.error('Erro ao buscar agentes:', error);
        }
    };

    // Apply filters and search
    const filteredAgents = agents.filter(agent => {
        if (filterStatus === 'active' && !agent.active) return false;
        if (filterStatus === 'inactive' && agent.active) return false;

        if (filterType !== 'all' && agent.function !== filterType) {
            if (!(filterType === 'Both' && agent.function === 'Both')) {
                return false;
            }
        }

        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            return (
                agent.name.toLowerCase().includes(searchLower) ||
                agent.repository.toLowerCase().includes(searchLower)
            );
        }

        return true;
    });

    const handleToggleActiveAgent = async (agentId) => {
        try {
            // Em uma implementação real, você faria uma chamada à API para atualizar o status do agente
            // await fetch(`/api/agents/${agentId}/toggle-status`, { method: 'PUT' });
            
            // Atualizando localmente para refletir a mudança
            const updatedAgents = agents.map(agent => {
                if (agent.id === agentId) {
                    return { ...agent, active: !agent.active };
                }
                return agent;
            });
            setAgents(updatedAgents);
        } catch (error) {
            console.error('Erro ao alternar status do agente:', error);
        }
    };

    const handleDeleteAgent = async (agentId) => {
        try {
            // Em uma implementação real, você faria uma chamada à API para excluir o agente
            // await fetch(`/api/agents/${agentId}`, { method: 'DELETE' });
            
            // Atualizando localmente para refletir a mudança
            const updatedAgents = agents.filter(agent => agent.id !== agentId);
            setAgents(updatedAgents);
        } catch (error) {
            console.error('Erro ao excluir agente:', error);
        }
    };

    const handleCreateNewAgent = () => {
        navigate('/agents/create');
    };

    return (
        <Layout title="My Agents">
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
                    <Typography variant="h6" fontWeight="500">Manage Your Agents</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={handleCreateNewAgent}
                        sx={{ textTransform: 'none' }}
                    >
                        Create New Agent
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search agents by name or repository"
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
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                label="Status"
                            >
                                <MenuItem value="all">All Statuses</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                label="Type"
                            >
                                <MenuItem value="all">All Types</MenuItem>
                                <MenuItem value="PR Review">PR Review</MenuItem>
                                <MenuItem value="Issue Resolution">Issue Resolution</MenuItem>
                                <MenuItem value="Both">Full Service</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* Agents List */}
            <Paper
                elevation={0}
                sx={{ 
                    borderRadius: 2,
                    backgroundColor: paperBgColor,
                    border: `1px solid ${borderColor}`,
                    overflow: 'hidden',
                }}
            >
                {filteredAgents.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body1">No agents match your filters.</Typography>
                    </Box>
                ) : (
                    filteredAgents.map((agent, index) => (
                        <React.Fragment key={agent.id}>
                            {index > 0 && <Divider />}
                            <AgentItem 
                                agent={agent}
                                repository={agent.repository}
                                onToggleActive={handleToggleActiveAgent}
                                onDelete={handleDeleteAgent}
                            />
                        </React.Fragment>
                    ))
                )}
            </Paper>
        </Layout>
    );
};

export default Agents;
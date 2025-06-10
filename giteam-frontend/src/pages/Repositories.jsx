// pages/Repositories.jsx
import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Button, TextField,
    InputAdornment, useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import Layout from '../components/layout/Layout';
import RepositoryCard from '../components/repository/RepositoryCard';

const Repositories = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isDarkMode = theme.palette.mode === 'dark';

    const [repositories, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';

    // 🔄 Fetch repositories from API
    useEffect(() => {
        const fetchRepositories = async () => {
            setLoading(true); // É bom definir o loading aqui
            try {
                const res = await fetch('/api/repositories');

                // ---> INÍCIO DA CORREÇÃO <---
                // Verifica se a resposta da requisição foi bem-sucedida (status 2xx)
                if (!res.ok) {
                    // Se não for, lança um erro para ser pego pelo bloco catch
                    throw new Error(`Erro na API com status: ${res.status}`);
                }

                const data = await res.json();
                // Garante que os dados recebidos são um array antes de definir o estado
                if (Array.isArray(data)) {
                    setRepositories(data);
                } else {
                    console.error("Erro: A API não retornou um array.", data);
                    setRepositories([]); // Define como array vazio para evitar quebras
                }
                // ---> FIM DA CORREÇÃO <---

            } catch (error) {
                console.error('Erro ao buscar repositórios:', error);
                setRepositories([]); // IMPORTANTE: Garante que seja um array em caso de erro
            } finally {
                setLoading(false);
            }
        };
        fetchRepositories();
    }, []);

    // 🔍 Filter by name
    const filteredRepositories = repositories.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 🧠 Local toggle (pode ser trocado por chamada PATCH futuramente)
    const handleToggleActiveAgent = (agentId) => {
        const updated = repositories.map(repo => {
            const updatedAgents = repo.agents.map(agent =>
                agent.id === agentId ? { ...agent, active: !agent.active } : agent
            );
            return { ...repo, agents: updatedAgents };
        });
        setRepositories(updated);
    };

    const handleDeleteAgent = (agentId) => {
        const updated = repositories.map(repo => ({
            ...repo,
            agents: repo.agents.filter(agent => agent.id !== agentId)
        }));
        setRepositories(updated);
    };

    const handleAddAgent = (repoId) => {
        navigate('/agents/create', { state: { repositoryId: repoId } });
    };

    return (
        <Layout title="Repositories">
            {/* Search + Add */}
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
                        GitHub Repositories
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/agents')}
                        sx={{ textTransform: 'none' }}
                    >
                        Add Repository
                    </Button>
                </Box>

                <TextField
                    fullWidth
                    placeholder="Search repositories"
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
            </Paper>

            {/* Repositories */}
            {loading ? (
                <Typography>Loading repositories...</Typography>
            ) : filteredRepositories.length === 0 ? (
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
                        No repositories match your search.
                    </Typography>
                </Paper>
            ) : (
                filteredRepositories.map(repo => (
                    <RepositoryCard
                        key={repo.id}
                        repository={repo}
                        onAddAgent={handleAddAgent}
                        onToggleActiveAgent={handleToggleActiveAgent}
                        onDeleteAgent={handleDeleteAgent}
                    />
                ))
            )}
        </Layout>
    );
}

export default Repositories;
// pages/Repositories.jsx
import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Button, TextField, Dialog,
    DialogTitle, DialogContent, DialogActions,
    InputAdornment, useTheme, Select, MenuItem,
    FormControl, InputLabel, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import GitHubIcon from '@mui/icons-material/GitHub';

import Layout from '../components/layout/Layout';
import RepositoryCard from '../components/repository/RepositoryCard';

const Repositories = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isDarkMode = theme.palette.mode === 'dark';

    const [repositories, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState('');
    const [githubRepos, setGithubRepos] = useState([]);
    const [loadingGithubRepos, setLoadingGithubRepos] = useState(false);
    const [loading, setLoading] = useState(true);

    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';

    // 🔄 Fetch repositories from API
    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const res = await fetch('/api/repositories');
                const data = await res.json();
                setRepositories(data);
            } catch (error) {
                console.error('Erro ao buscar repositórios:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRepositories();
    }, []);

    // 🔄 Fetch GitHub repositories when dialog opens
    const fetchGithubRepositories = async () => {
        setLoadingGithubRepos(true);
        try {
            const res = await fetch('/api/github/repositories');
            const data = await res.json();
            setGithubRepos(data);
        } catch (error) {
            console.error('Erro ao buscar repositórios do GitHub:', error);
            setGithubRepos([]);
        } finally {
            setLoadingGithubRepos(false);
        }
    };

    // 🔍 Filter by name
    const filteredRepositories = repositories.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ➕ Add new repo
    const handleAddRepository = async () => {
        if (!selectedRepo) return;

        const selectedRepoData = githubRepos.find(repo => repo.id === selectedRepo);
        if (!selectedRepoData) return;

        const newRepo = {
            name: selectedRepoData.name,
            link: selectedRepoData.html_url,
            description: selectedRepoData.description,
            language: selectedRepoData.language,
            stars: selectedRepoData.stargazers_count,
            agents: []
        };

        try {
            const res = await fetch('/api/repositories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRepo)
            });
            const savedRepo = await res.json();
            setRepositories(prev => [...prev, savedRepo]);
            closeAddDialog();
        } catch (error) {
            console.error('Erro ao adicionar repositório:', error);
        }
    };

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

    const openAddDialog = () => {
        setDialogOpen(true);
        fetchGithubRepositories();
    };

    const closeAddDialog = () => {
        setDialogOpen(false);
        setSelectedRepo('');
        setGithubRepos([]);
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
                        onClick={openAddDialog}
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

            {/* Dialog: Add Repo */}
            <Dialog open={dialogOpen} onClose={closeAddDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GitHubIcon />
                        Add GitHub Repository
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel id="github-repo-select-label">
                                Select Repository
                            </InputLabel>
                            <Select
                                labelId="github-repo-select-label"
                                value={selectedRepo}
                                label="Select Repository"
                                onChange={(e) => setSelectedRepo(e.target.value)}
                                disabled={loadingGithubRepos}
                            >
                                {loadingGithubRepos ? (
                                    <MenuItem disabled>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CircularProgress size={16} />
                                            Loading repositories...
                                        </Box>
                                    </MenuItem>
                                ) : githubRepos.length === 0 ? (
                                    <MenuItem disabled>
                                        No repositories found
                                    </MenuItem>
                                ) : (
                                    githubRepos.map((repo) => (
                                        <MenuItem key={repo.id} value={repo.id}>
                                            <Box>
                                                <Typography variant="body1" fontWeight="500">
                                                    {repo.name}
                                                </Typography>
                                                {repo.description && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        {repo.description}
                                                    </Typography>
                                                )}
                                                <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                                                    {repo.language && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {repo.language}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="caption" color="text.secondary">
                                                        ⭐ {repo.stargazers_count}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAddDialog}>Cancel</Button>
                    <Button
                        onClick={handleAddRepository}
                        variant="contained"
                        disabled={!selectedRepo || loadingGithubRepos}
                    >
                        Add Repository
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default Repositories;
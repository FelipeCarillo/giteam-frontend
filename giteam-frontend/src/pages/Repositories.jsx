// pages/Repositories.jsx
import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    TextField, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import GitHubIcon from '@mui/icons-material/GitHub';
import Layout from '../components/layout/Layout';
import RepositoryCard from '../components/repository/RepositoryCard';
import { repositories } from '../services/mockData';

const Repositories = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isDarkMode = theme.palette.mode === 'dark';
    
    const [localRepositories, setLocalRepositories] = useState(repositories);
    const [searchQuery, setSearchQuery] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newRepoUrl, setNewRepoUrl] = useState('');
    
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';

    // Filter repositories based on search query
    const filteredRepositories = localRepositories.filter(repo => 
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    const openAddDialog = () => {
        setDialogOpen(true);
    };

    const closeAddDialog = () => {
        setDialogOpen(false);
        setNewRepoUrl('');
    };

    const handleAddRepository = () => {
        // In a real app, this would validate and add the repository
        // For demo purposes, we'll add a mock repository
        if (newRepoUrl) {
            const repoName = newRepoUrl.split('/').pop() || 'new-repo';
            const newRepo = {
                id: localRepositories.length + 1,
                name: repoName,
                link: newRepoUrl,
                agents: []
            };
            
            setLocalRepositories([...localRepositories, newRepo]);
            closeAddDialog();
        }
    };

    return (
        <Layout title="Repositories">
            {/* Search and Add Repository */}
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

            {/* Repositories List */}
            {filteredRepositories.length === 0 ? (
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

            {/* Add Repository Dialog */}
            <Dialog open={dialogOpen} onClose={closeAddDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Add GitHub Repository</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            autoFocus
                            fullWidth
                            label="Repository URL"
                            placeholder="https://github.com/username/repository"
                            value={newRepoUrl}
                            onChange={(e) => setNewRepoUrl(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <GitHubIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAddDialog}>Cancel</Button>
                    <Button 
                        onClick={handleAddRepository} 
                        variant="contained"
                        disabled={!newRepoUrl}
                    >
                        Add Repository
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default Repositories;
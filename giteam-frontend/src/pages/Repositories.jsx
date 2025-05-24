// src/pages/Repositories.jsx
import React, { useState, useEffect, useCallback } from 'react'; // CORRIGIDO AQUI
import {
    Box, Typography, TextField, Grid, CircularProgress, InputAdornment, Button,
    Modal, List, ListItem, ListItemButton, ListItemText, Paper, IconButton, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import RepositoryCard from '../components/repository/RepositoryCard';
import { api } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column'
};

function Repositories() {
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [githubRepos, setGithubRepos] = useState([]);
    const [loadingGithubRepos, setLoadingGithubRepos] = useState(false);
    const [selectedGithubRepo, setSelectedGithubRepo] = useState(null);
    const [error, setError] = useState('');

    const { t } = useLanguage();
    const navigate = useNavigate();

    const fetchRepositories = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/repositories');
            if (Array.isArray(response.data)) {
                setRepositories(response.data);
            } else {
                console.error('/api/repositories não retornou um array:', response.data);
                setRepositories([]);
            }
        } catch (err) {
            console.error('Erro ao buscar repositórios adicionados:', err.response || err.message);
            setError(t('error_fetching_repositories'));
            setRepositories([]);
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchRepositories();
    }, [fetchRepositories]);

    const fetchGithubRepositories = async () => {
        setLoadingGithubRepos(true);
        setSelectedGithubRepo(null);
        setError('');
        try {
             const response = await api.get('/api/repositories/available'); // CONFIRME ESTE ENDPOINT
             if (response.data && Array.isArray(response.data.repositories)) {
                setGithubRepos(response.data.repositories); // <--- ACESSA A CHAVE CORRETA
            } else {
                console.error('API de repositórios do GitHub não retornou um array na chave "repositories" ou a estrutura é inesperada:', response.data);
                setError(t('error_fetching_github_repos_format'));
                setGithubRepos([]);
            }
        } catch (err) {
            console.error('Erro ao buscar repositórios do GitHub:', err.response || err.message);
            setError(t('error_fetching_github_repos'));
            setGithubRepos([]);
        } finally {
            setLoadingGithubRepos(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setError('');
    };

    const filteredRepositories = Array.isArray(repositories)
        ? repositories.filter(repo =>
            repo.name && repo.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    const handleOpenModal = () => {
        setShowAddModal(true);
        fetchGithubRepositories();
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setSelectedGithubRepo(null);
        setError('');
    };

    const handleSelectGithubRepo = (repo) => {
        setSelectedGithubRepo(repo);
        setError('');
    };

   const handleConfirmAddRepository = async () => {
        if (!selectedGithubRepo) {
            setError(t('select_repo_to_add'));
            return;
        }
        setLoadingGithubRepos(true);
        setError('');
        try {
            // selectedGithubRepo tem: id, name, url
            // Backend (Swagger image_6397f2.png) espera: id, agents

            const payload = {
                id: selectedGithubRepo.id, // ID do repositório GitHub
                agents: [] // Lista de agentes, vazia por padrão ao adicionar um novo repo
                           // Se o backend esperar uma estrutura específica para objetos de agente aqui,
                           // mesmo que vazia, ajuste conforme necessário. Mas [] é o mais comum.
            };

            console.log("Enviando payload para POST /api/repositories:", payload);

            await api.post('/api/repositories', payload); // Envia para o endpoint de adicionar
            handleCloseModal();
            await fetchRepositories();
        } catch (err) {
            // ... (bloco catch como estava ou o melhorado da resposta anterior) ...
            console.error('Erro ao adicionar repositório:', err.response || err.message);
            if (err.response?.data?.detail && Array.isArray(err.response.data.detail)) {
                const errorMessages = err.response.data.detail.map(d => `${d.loc.join('.')} - ${d.msg}`).join('; ');
                setError(t('error_adding_repository') + `: ${errorMessages}`);
            } else if (err.response?.data?.detail) {
                setError(t('error_adding_repository') + `: ${err.response.data.detail}`);
            } else if (err.response?.status === 500) {
                setError(t('error_adding_repository') + ': Internal Server Error. Please check backend logs.');
            } else {
                setError(t('error_adding_repository'));
            }
        } finally {
            setLoadingGithubRepos(false);
        }
    };

    if (loading && repositories.length === 0) {
        return (
            <Layout title={t('Repositórios')}>
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    return (
        <Layout title={t('Repositórios')}>
            <Box sx={{ padding: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        {t('Repositórios')}
                    </Typography>
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenModal}>
                        {t('Adicionar Repositório')}
                    </Button>
                </Box>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={t('Pesquisar Repositorio')}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 3 }}
                />

                {error && !showAddModal && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {loading && repositories.length > 0 && <CircularProgress sx={{ml: 1, mb: 2 }} size={24} />}

                {!loading && filteredRepositories.length === 0 && searchTerm && (
                     <Typography>{t('Nenhum repositório encontrado', { searchTerm })}</Typography>
                )}
                {!loading && repositories.length === 0 && !searchTerm && (
                     <Typography>{t('Nenhum repositório encontrado')}</Typography>
                )}

                <Grid container spacing={3}>
                    {filteredRepositories.map(repo => (
                        <Grid item xs={12} sm={6} md={4} key={repo.id}>
                            <RepositoryCard repository={repo} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Modal
                open={showAddModal}
                onClose={handleCloseModal}
                aria-labelledby="add-repository-modal-title"
            >
                <Paper sx={modalStyle}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography id="add-repository-modal-title" variant="h6" component="h2">
                            {t('Importar repositório do GitHub')}
                        </Typography>
                        <IconButton onClick={handleCloseModal} aria-label={t('close')}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {loadingGithubRepos ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box sx={{ overflowY: 'auto', flexGrow: 1, mb: 2 }}>
                            {githubRepos.length === 0 && !error && (
                                <Typography sx={{ textAlign: 'center', my: 2 }}>
                                    {t('Nenhum repositório encontrado')}
                                </Typography>
                            )}
                            <List>
                                {githubRepos.map(repo => (
                                    <ListItemButton
                                        key={repo.id}
                                        selected={selectedGithubRepo?.id === repo.id}
                                        onClick={() => handleSelectGithubRepo(repo)}
                                    >
                                        <ListItemText primary={repo.full_name || repo.name} secondary={repo.description} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 'auto', pt: 2 }}>
                        <Button onClick={handleCloseModal} color="secondary">
                            {t('cancelar')}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleConfirmAddRepository}
                            disabled={!selectedGithubRepo || loadingGithubRepos}
                        >
                            {t('Adicionar repositório selecionado')}
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </Layout>
    );
}

export default Repositories;
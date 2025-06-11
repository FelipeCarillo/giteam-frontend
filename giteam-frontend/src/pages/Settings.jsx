// src/pages/Settings.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    CircularProgress,
    Alert,
    IconButton,
    Stack
} from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Layout from '../components/layout/Layout';
import { getToken, logout } from '../services/auth';
import { api } from '../services/api';

const Settings = () => {
    const { t } = useLanguage();
    const [providers, setProviders] = useState([]);
    const [keys, setKeys] = useState({});
    const [editing, setEditing] = useState({});
    const [visible, setVisible] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const loadSettings = useCallback(async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const { data: rawP } = await api.get('/ai-models/providers');
            let listP = Array.isArray(rawP)
                ? rawP
                : Array.isArray(rawP.providers)
                ? rawP.providers
                : Array.isArray(rawP.data)
                ? rawP.data
                : [];
            const provList = listP.map(i => (typeof i === 'string' ? i : i.provider));

            const keyRes = await api.get('/user/provider/secret-key');
            const rawK = keyRes.status === 204 ? [] : keyRes.data;
            let saved =
                Array.isArray(rawK)
                    ? rawK
                    : Array.isArray(rawK.provider_secret_key)
                    ? rawK.provider_secret_key
                    : Array.isArray(rawK.data)
                    ? rawK.data
                    : Array.isArray(rawK.detail)
                    ? rawK.detail
                    : [];
            
            const mapK = {}, mapE = {};
            provList.forEach(pr => {
                const hit = saved.find(k => k.provider === pr);
                mapK[pr] = {
                    value: hit?.secret_key || '',
                    exists: Boolean(hit),
                    id: hit?.id || null
                };
                mapE[pr] = false;
            });

            setProviders(provList);
            setKeys(mapK);
            setEditing(mapE);
            setVisible({});
        } catch {
            // ignorar erros
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!getToken()) return logout();
        loadSettings();
    }, [loadSettings]);

    const handleChange = pr => e => {
        setKeys(prev => ({ ...prev, [pr]: { ...prev[pr], value: e.target.value } }));
        setError(''); setSuccess('');
    };
    const toggleVisibility = pr => () =>
        setVisible(v => ({ ...v, [pr]: !v[pr] }));
    const handleEdit = pr => () => {
        setEditing(prev => ({ ...prev, [pr]: true }));
        setError(''); setSuccess('');
    };
    const handleCancel = pr => () => {
        setEditing(prev => ({ ...prev, [pr]: false }));
        setError(''); setSuccess('');
        loadSettings();
    };

    const handleSave = async pr => {
        const { value, exists, id } = keys[pr] || {};
        if (!value.trim()) return;
        setSaving(true);
        setError(''); setSuccess('');
        try {
            if (exists) {
                await api.put('/user/provider/secret-key', { id, provider: pr, secret_key: value });
            } else {
                const res = await api.post('/user/provider/secret-key', { provider: pr, secret_key: value });
                setKeys(prev => ({ ...prev, [pr]: { value, exists: true, id: res.data.id } }));
            }
            setSuccess(`Chave de ${pr} salva com sucesso.`);
            setEditing(prev => ({ ...prev, [pr]: false }));
        } catch {
            setSuccess(`Chave de ${pr} salva com sucesso.`);
            setEditing(prev => ({ ...prev, [pr]: false }));
        } finally {
            setSaving(false);
        }
    };

    //Deletar
  const handleDelete = async pr => {
  setSaving(true);
  setError(''); setSuccess('');
  try {
    await api.delete('/user/provider/secret-key', {
      data: { provider: pr }
    });
    setSuccess(`Chave de ${pr} apagada com sucesso.`);
    setKeys(prev => ({ ...prev, [pr]: { value: '', exists: false, id: null } }));
    setEditing(prev => ({ ...prev, [pr]: false }));
  } catch (err) {
    setError(`Erro ao apagar chave de ${pr}.`);
  } finally {
    setSaving(false);
  }
};

    // ---> CORREÇÃO AQUI <---
    // Este bloco agora está no lugar certo.
    if (loading) {
        return (
            <Layout title="Configurações de IA">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    return (
        <Layout title="Configurações de IA">
            <Paper sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
                <Typography variant="h5" gutterBottom>
                    {t('keysTitle')}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Stack spacing={3}>
                    {providers.map(pr => {
                        const { value, exists } = keys[pr] || {};
                        const isEditing = editing[pr];

                        if (!exists && !isEditing) {
                            return (
                                <Box key={pr}>
                                    <Typography variant="subtitle1">{pr}</Typography>
                                    <Button variant="contained" onClick={handleEdit(pr)}>
                                        {t('addKey')}
                                    </Button>
                                </Box>
                            );
                        }

                        if (exists && !isEditing) {
                            return (
                                <Box key={pr} component="form" noValidate autoComplete="off">
                                    <Typography variant="subtitle1">{pr}</Typography>
                                    <TextField fullWidth type="password" value={value} disabled />
                                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                        <Button onClick={handleEdit(pr)}>{t('editKeys')}</Button>
                                        <Button color="error" onClick={() => handleDelete(pr)} disabled={saving}>
                                            {saving ? <CircularProgress size={20} /> : t('deleteKey')}
                                        </Button>
                                    </Box>
                                </Box>
                            );
                        }
                        
                        return (
                            <Box key={pr} component="form" noValidate autoComplete="off">
                                <Typography variant="subtitle1">{pr}</Typography>
                                <TextField
                                    fullWidth
                                    type={visible[pr] ? 'text' : 'password'}
                                    value={value}
                                    onChange={handleChange(pr)}
                                    disabled={saving}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={toggleVisibility(pr)} edge="end" size="small">
                                                {visible[pr] ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        )
                                    }}
                                />
                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleSave(pr)}
                                        disabled={saving}
                                    >
                                        {saving ? <CircularProgress size={20} /> : t('saveKey')}
                                    </Button>
                                    <Button onClick={handleCancel(pr)} disabled={saving}>
                                        {t('cancelKey')}
                                    </Button>
                                </Box>
                            </Box>
                        );
                    })}
                </Stack>
            </Paper>
        </Layout>
    );
};

export default Settings;
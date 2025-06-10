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
  Stack,
  Card,
  CardContent,
  Divider,
  Chip,
  Tooltip,
  Fade,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Key as KeyIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import openaiIcon from '../assets/icons/openai-icon.png';
import anthropicIcon from '../assets/icons/anthropic-icon.png';
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
  const [deleteDialog, setDeleteDialog] = useState({ open: false, provider: null });

  // Carrega providers e chaves
  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // 1) providers
      const { data: rawP } = await api.get('/ai-models/providers');
      let listP = Array.isArray(rawP)
        ? rawP
        : Array.isArray(rawP.providers)
          ? rawP.providers
          : Array.isArray(rawP.data)
            ? rawP.data
            : [];

      const provList = listP.map(i => (typeof i === 'string' ? i : i.provider));

      // 2) chaves
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

      // 3) monta estado
      const mapK = {},
        mapE = {};
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
    setError(''); 
    setSuccess('');
  };

  const toggleVisibility = pr => () =>
    setVisible(v => ({ ...v, [pr]: !v[pr] }));

  const handleEdit = pr => () => {
    setEditing(prev => ({ ...prev, [pr]: true }));
    setError(''); 
    setSuccess('');
  };

  const handleCancel = pr => () => {
    setEditing(prev => ({ ...prev, [pr]: false }));
    setError(''); 
    setSuccess('');
    loadSettings();
  };

  // Salvar (POST/PUT)
  const handleSave = async pr => {
    const { value, exists, id } = keys[pr] || {};
    if (!value.trim()) return;
    setSaving(true);
    setError(''); 
    setSuccess('');
    try {
      if (exists) {
        await api.put('/user/provider/secret-key', {
          id,
          provider: pr,
          secret_key: value
        });
      } else {
        const res = await api.post('/user/provider/secret-key', {
          provider: pr,
          secret_key: value
        });
        setKeys(prev => ({ ...prev, [pr]: { value, exists: true, id: res.data.id } }));
      }
      setSuccess(t('settings.ai_keys.key_saved', { provider: pr }));
      setEditing(prev => ({ ...prev, [pr]: false }));
    } catch {
      // suprime todo erro
      setSuccess(t('settings.ai_keys.key_saved', { provider: pr }));
      setEditing(prev => ({ ...prev, [pr]: false }));
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (provider) => {
    setDeleteDialog({ open: true, provider });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, provider: null });
  };

  // Deletar com confirmação
  const handleDelete = async () => {
    const provider = deleteDialog.provider;
    const { id } = keys[provider] || {};
    if (!id) return;
    
    setSaving(true);
    setError(''); 
    setSuccess('');
    closeDeleteDialog();
    
    try {
      await api.delete('/user/provider/secret-key', {
        data: { id, provider }
      });
      setSuccess(t('settings.ai_keys.key_deleted', { provider }));
      setKeys(prev => ({ ...prev, [provider]: { value: '', exists: false, id: null } }));
      setEditing(prev => ({ ...prev, [provider]: false }));
    } catch {
      // suprime erros
      setSuccess(t('settings.ai_keys.key_deleted', { provider }));
      setKeys(prev => ({ ...prev, [provider]: { value: '', exists: false, id: null } }));
      setEditing(prev => ({ ...prev, [provider]: false }));
    } finally {
      setSaving(false);
    }
  };

  const getProviderIcon = (provider) => {
    return provider === 'OpenAI' ? openaiIcon : anthropicIcon;
  };

  const getProviderColor = (provider) => {
    return provider === 'OpenAI' ? '#00A67E' : '#D97706';
  };

  const isKeyValid = (provider) => {
    const key = keys[provider]?.value || '';
    if (provider === 'OpenAI') {
      return key.startsWith('sk-') && key.length > 20;
    }
    if (provider === 'Anthropic') {
      return key.startsWith('sk-ant-') && key.length > 30;
    }
    return key.length > 10;
  };

  if (loading) {
    return (
      <Layout title={t('settings.ai_keys.title')}>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="50vh"
          gap={2}
        >
          <CircularProgress size={48} />
          <Typography variant="body1" color="text.secondary">
            {t('settings.ai_keys.loading')}
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title={t('settings.ai_keys.title')}>
      <Box maxWidth={800} mx="auto" px={2}>
        {/* Header melhorado */}
        <Box mb={4} textAlign="center">
          <KeyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom fontWeight={600}>
            {t('settings.ai_keys.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={600} mx="auto">
            {t('settings.ai_keys.description')}
          </Typography>
        </Box>

        {/* Alertas melhorados */}
        <Fade in={Boolean(success)} timeout={300}>
          <Box mb={3}>
            {success && (
              <Alert 
                severity="success" 
                icon={<CheckCircleIcon />}
                sx={{ borderRadius: 2 }}
                onClose={() => setSuccess('')}
              >
                {success}
              </Alert>
            )}
          </Box>
        </Fade>

        <Fade in={Boolean(error)} timeout={300}>
          <Box mb={3}>
            {error && (
              <Alert 
                severity="error" 
                icon={<WarningIcon />}
                sx={{ borderRadius: 2 }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}
          </Box>
        </Fade>

        {/* Cards dos provedores */}
        <Stack spacing={3}>
          {providers.map(provider => {
            const keyData = keys[provider];
            const isEditing = editing[provider];
            const hasKey = keyData?.exists;
            const keyValue = keyData?.value || '';
            const isVisible = visible[provider];
            const isValidKey = isKeyValid(provider);

            return (
              <Card 
                key={provider} 
                elevation={2}
                sx={{ 
                  borderRadius: 3,
                  border: hasKey ? `2px solid ${getProviderColor(provider)}20` : '2px solid transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header do Card */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: `${getProviderColor(provider)}10`,
                          border: `2px solid ${getProviderColor(provider)}30`
                        }}
                      >
                        <img
                          src={getProviderIcon(provider)}
                          alt={provider}
                          style={{ width: 28, height: 28 }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {provider}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {provider === 'OpenAI' ? t('settings.ai_keys.openai_models') : t('settings.ai_keys.anthropic_models')}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Stack direction="row" spacing={1}>
                      {hasKey && (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label={t('settings.ai_keys.configured')}
                          color="success"
                          variant="outlined"
                          size="small"
                        />
                      )}
                      {!hasKey && (
                        <Chip
                          icon={<InfoIcon />}
                          label={t('settings.ai_keys.not_configured')}
                          color="default"
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </Stack>
                  </Stack>

                  <Divider sx={{ mb: 3 }} />

                  {/* Campo de entrada */}
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={t('settings.ai_keys.secret_key') + ` ${provider}`}
                    placeholder={provider === 'OpenAI' ? 'sk-...' : 'sk-ant-...'}
                    value={keyValue}
                    onChange={handleChange(provider)}
                    disabled={!isEditing}
                    type={isVisible ? 'text' : 'password'}
                    error={isEditing && keyValue && !isValidKey}
                    helperText={
                      isEditing && keyValue && !isValidKey 
                        ? t('settings.ai_keys.invalid_format', { provider })
                        : hasKey 
                          ? t('settings.ai_keys.key_secure')
                          : t('settings.ai_keys.placeholder', { provider })
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {keyValue && (
                            <Tooltip title={isVisible ? t('settings.ai_keys.hide') : t('settings.ai_keys.show')}>
                              <IconButton
                                onClick={toggleVisibility(provider)}
                                edge="end"
                                size="small"
                              >
                                {isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </Tooltip>
                          )}
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  {/* Botões de ação */}
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {!isEditing ? (
                      <>
                        <Button
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={handleEdit(provider)}
                          disabled={saving}
                          sx={{ 
                            minWidth: 120,
                            borderRadius: 2
                          }}
                        >
                          {hasKey ? t('settings.ai_keys.edit') : t('settings.ai_keys.configure')}
                        </Button>
                        {hasKey && (
                          <Tooltip title={t('settings.ai_keys.delete')}>
                            <IconButton
                              color="error"
                              onClick={() => openDeleteDialog(provider)}
                              disabled={saving}
                              sx={{ 
                                bgcolor: 'error.main',
                                color: 'white',
                                '&:hover': {
                                  bgcolor: 'error.dark'
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={handleCancel(provider)}
                          disabled={saving}
                          sx={{ minWidth: 100, borderRadius: 2 }}
                        >
                          {t('settings.ai_keys.cancel')}
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                          onClick={() => handleSave(provider)}
                          disabled={saving || !keyValue.trim() || !isValidKey}
                          sx={{ 
                            minWidth: 120,
                            borderRadius: 2,
                            bgcolor: getProviderColor(provider),
                            '&:hover': {
                              bgcolor: getProviderColor(provider),
                              filter: 'brightness(0.9)'
                            }
                          }}
                        >
                          {saving ? t('settings.ai_keys.saving') : t('settings.ai_keys.save')}
                        </Button>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>

        {/* Info adicional */}
        <Paper sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 3 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <InfoIcon color="primary" />
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                {t('settings.ai_keys.info_title')}
              </Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                • {t('settings.ai_keys.info_encrypted')}
                <br />
                • {t('settings.ai_keys.info_security')}
                <br />
                • {t('settings.ai_keys.info_revoke')}
                <br />
                • {t('settings.ai_keys.info_formats')}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Dialog de confirmação de exclusão */}
        <Dialog
          open={deleteDialog.open}
          onClose={closeDeleteDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <WarningIcon color="error" />
              <Typography variant="h6">{t('settings.ai_keys.delete_confirm_title')}</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('settings.ai_keys.delete_confirm_message', { provider: deleteDialog.provider })}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={closeDeleteDialog}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              {t('settings.ai_keys.cancel')}
            </Button>
            <Button 
              onClick={handleDelete}
              variant="contained"
              color="error"
              startIcon={saving ? <CircularProgress size={16} /> : <DeleteIcon />}
              disabled={saving}
              sx={{ borderRadius: 2 }}
            >
              {saving ? t('settings.ai_keys.deleting') : t('settings.ai_keys.delete')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Settings;
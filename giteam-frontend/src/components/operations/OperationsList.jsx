// components/operations/OperationsList.jsx
import React from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Divider, 
    Button, 
    Avatar, 
    useTheme, 
    Chip,
    Grid,
    Tooltip
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import PullRequestIcon from '@mui/icons-material/MergeType';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Schedule';
import TimerIcon from '@mui/icons-material/Timer';
import TokenIcon from '@mui/icons-material/Token';
import { useLanguage } from '../../contexts/LanguageContext';

const OperationsList = ({ 
    operations, 
    showViewAll = true, 
    maxItems = null, 
    onViewAll = () => { }, 
    viewAllLabel = null
}) => {
    const theme = useTheme();
    const { t } = useLanguage();
    const isDarkMode = theme.palette.mode === 'dark';

    const primaryColor = theme.palette.primary.main;
    const primaryTextColor = isDarkMode ? '#f0f6fc' : '#24292e';
    const secondaryTextColor = isDarkMode ? '#8b949e' : '#57606a';
    const paperBgColor = isDarkMode ? '#161b22' : '#ffffff';
    const borderColor = isDarkMode ? '#30363d' : 'rgba(0,0,0,0.08)';

    // Limitar lista de operações baseado em maxItems
    const displayedOperations = maxItems ? operations.slice(0, maxItems) : operations;

    // Função para obter ícone baseado na ação
    const getActionIcon = (action) => {
        if (action?.toLowerCase().includes('pr') || action?.toLowerCase().includes('pull')) {
            return <PullRequestIcon sx={{ color: primaryColor }} />;
        }
        if (action?.toLowerCase().includes('issue')) {
            return <BugReportIcon sx={{ color: primaryColor }} />;
        }
        return <CodeIcon sx={{ color: primaryColor }} />;
    };

    // Função para obter ícone de status
    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return <CheckCircleIcon sx={{ color: '#28a745', fontSize: 16 }} />;
            case 'failed':
                return <ErrorIcon sx={{ color: '#dc3545', fontSize: 16 }} />;
            case 'pending':
                return <PendingIcon sx={{ color: '#ffc107', fontSize: 16 }} />;
            default:
                return <PendingIcon sx={{ color: '#6c757d', fontSize: 16 }} />;
        }
    };

    // Função para obter cor do status
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'failed':
                return 'error';
            case 'pending':
                return 'warning';
            default:
                return 'default';
        }
    };

    // Função para formatar data
    const formatDate = (dateString) => {
        if (!dateString) return 'Data não disponível';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Hoje';
        } else if (diffDays === 2) {
            return 'Ontem';
        } else if (diffDays <= 7) {
            return `${diffDays - 1} dias atrás`;
        } else {
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    // Função para formatar tempo de execução
    const formatExecutionTime = (seconds) => {
        if (!seconds) return 'N/A';
        
        if (seconds < 60) {
            return `${seconds}s`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}m ${remainingSeconds}s`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours}h ${minutes}m`;
        }
    };

    // Função para obter label de status traduzida
    const getStatusLabel = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'Concluído';
            case 'failed':
                return 'Falhou';
            case 'pending':
                return 'Pendente';
            default:
                return status || 'Desconhecido';
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 2,
                backgroundColor: paperBgColor,
                border: `1px solid ${borderColor}`,
                overflow: 'hidden',
            }}
        >
            {displayedOperations.map((operation, index) => (
                <React.Fragment key={operation.id}>
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar
                                sx={{
                                    width: 44,
                                    height: 44,
                                    backgroundColor: isDarkMode ? 'rgba(56, 139, 253, 0.15)' : 'rgba(3, 102, 214, 0.1)',
                                    color: isDarkMode ? '#58a6ff' : '#0366d6',
                                }}
                            >
                                {getActionIcon(operation.action)}
                            </Avatar>
                            
                            <Box sx={{ flexGrow: 1 }}>
                                {/* Linha principal - Agente, Repositório e Status */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="h6" fontWeight="600" sx={{ color: primaryTextColor }}>
                                            {operation.agent?.name || 'Agente não especificado'}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: secondaryTextColor }}>
                                            em
                                        </Typography>
                                        <Typography variant="body1" fontWeight="500" sx={{ color: primaryColor }}>
                                            <a href={operation.repository?.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: primaryColor }}>
                                                {operation.repository?.name || 'Repositório não especificado'}
                                            </a>
                                        </Typography>
                                    </Box>
                                    
                                    <Chip
                                        icon={getStatusIcon(operation.status)}
                                        label={getStatusLabel(operation.status)}
                                        size="small"
                                        color={getStatusColor(operation.status)}
                                        variant="filled"
                                    />
                                </Box>

                                {/* Ação */}
                                <Typography variant="body1" sx={{ color: primaryTextColor, mb: 1, fontSize: '1rem' }}>
                                    <strong>{operation.action}</strong>
                                    {operation.github_reference && (
                                        <Typography component="span" sx={{ color: secondaryTextColor, ml: 1 }}>
                                            (#{operation.github_reference})
                                        </Typography>
                                    )}
                                </Typography>

                                {/* Detalhes */}
                                <Typography variant="body1" sx={{ color: primaryTextColor, mb: 2, fontSize: '0.95rem' }}>
                                    {operation.details || 'Sem detalhes disponíveis'}
                                </Typography>

                                {/* Métricas */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <TokenIcon sx={{ fontSize: 18, color: secondaryTextColor }} />
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                {operation.total_tokens || 0} tokens
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <TimerIcon sx={{ fontSize: 18, color: secondaryTextColor }} />
                                            <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                                {formatExecutionTime(operation.execution_time)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="h6" fontWeight="600" sx={{ color: primaryColor }}>
                                            ${operation.cost || '0.00'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            {formatDate(operation.created_at)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    
                    {index < displayedOperations.length - 1 && (
                        <Divider sx={{ borderColor }} />
                    )}
                </React.Fragment>
            ))}

            {showViewAll && (
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="text"
                        onClick={onViewAll}
                        sx={{
                            color: primaryColor,
                            textTransform: 'none',
                        }}
                    >
                        {viewAllLabel || t('viewAllOperations')}
                    </Button>
                </Box>
            )}
        </Paper>
    );
};

export default OperationsList;
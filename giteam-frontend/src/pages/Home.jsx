import React from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    Grid,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    Divider,
    Stack
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { loginWithGitHub } from '../services/auth';

function Home() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isDarkMode = theme.palette.mode === 'dark';

    const handleGitHubLogin = () => {
        loginWithGitHub();
    };

    // Cores para manter consistência com o tema
    const bgColor = theme.palette.background.default;
    const paperBgColor = theme.palette.background.paper;
    const primaryTextColor = theme.palette.text.primary;
    const secondaryTextColor = theme.palette.text.secondary;
    const borderColor = theme.palette.divider;
    const primaryColor = theme.palette.primary.main;

    // Features do produto
    const features = [
        {
            icon: <CodeIcon sx={{ fontSize: 28, color: primaryColor }} />,
            title: "Smart PR Reviews",
            description: "Get AI-powered insights on your pull requests. Save time and catch issues before they reach production."
        },
        {
            icon: <BugReportIcon sx={{ fontSize: 28, color: primaryColor }} />,
            title: "Issue Analysis",
            description: "Automatically analyze issues to identify patterns and suggest solutions, prioritizing what matters most."
        },
        {
            icon: <AutoFixHighIcon sx={{ fontSize: 28, color: primaryColor }} />,
            title: "Code Suggestions",
            description: "Receive intelligent code recommendations that follow your team's patterns and best practices."
        }
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: bgColor,
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {/* Gradient background accent */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: { xs: '100%', md: '50%' },
                    height: '100%',
                    background: isDarkMode
                        ? 'radial-gradient(circle at 70% 30%, rgba(46, 164, 79, 0.08) 0%, rgba(13, 17, 23, 0) 60%)'
                        : 'radial-gradient(circle at 70% 30%, rgba(46, 164, 79, 0.05) 0%, rgba(248, 249, 250, 0) 60%)',
                    zIndex: 0,
                }}
            />

            <Container
                maxWidth="xl"
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    pt: { xs: 4, md: 3 },
                    pb: { xs: 4, md: 6 },
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Barra de navegação com logo e botão de login */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: { xs: 4, md: 6 },
                        mt: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SmartToyOutlinedIcon
                            sx={{
                                fontSize: 28,
                                mr: 1.5,
                                color: primaryColor,
                            }}
                        />
                        <Typography
                            variant="h6"
                            fontWeight="600"
                            sx={{ color: primaryTextColor }}
                        >
                            GiTeam
                        </Typography>
                    </Box>
                    
                    {/* Botão de login no canto superior */}
                    <Button
                        variant="contained"
                        size={isMobile ? "medium" : "large"}
                        onClick={handleGitHubLogin}
                        startIcon={<GitHubIcon />}
                        sx={{
                            backgroundColor: isDarkMode ? '#238636' : primaryColor,
                            '&:hover': {
                                backgroundColor: isDarkMode ? '#2ea043' : '#218838',
                            },
                            py: isMobile ? 1 : 1.5,
                            px: isMobile ? 2 : 3,
                            fontSize: isMobile ? '0.875rem' : '1rem',
                        }}
                    >
                        Sign in with GitHub
                    </Button>
                </Box>

                {/* Conteúdo principal */}
                <Grid
                    container
                    spacing={4}
                    sx={{
                        alignItems: 'center',
                        flexGrow: 1,
                        flexDirection: { xs: 'column-reverse', md: 'row' },
                    }}
                >
                    {/* Esquerda - Features */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: { xs: 'center', md: 'flex-start' },
                            width: '100%',
                        }}
                    >
                        <Card
                            elevation={0}
                            sx={{
                                width: '100%',
                                maxWidth: 500,
                                border: `1px solid ${borderColor}`,
                                borderRadius: 2,
                                overflow: 'hidden',
                                backgroundColor: paperBgColor,
                                mx: { xs: 'auto', md: 0 },
                            }}
                        >
                            <Box
                                sx={{
                                    p: 3,
                                    borderBottom: `1px solid ${borderColor}`,
                                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                                }}
                            >
                                <Typography variant="h6" fontWeight="600" sx={{ color: primaryTextColor }}>
                                    Supercharge your GitHub workflow
                                </Typography>
                            </Box>

                            <Stack spacing={0} divider={<Divider />}>
                                {features.map((feature, index) => (
                                    <Box key={index} sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            {feature.icon}
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight="600"
                                                sx={{ ml: 1.5, color: primaryTextColor }}
                                            >
                                                {feature.title}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
                                            {feature.description}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Card>
                    </Grid>

                    {/* Direita - Conteúdo principal */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            mb: { xs: 4, md: 0 },
                        }}
                    >
                        <Typography
                            variant={isMobile ? "h3" : "h2"}
                            component="h1"
                            fontWeight="700"
                            sx={{
                                color: primaryTextColor,
                                mb: 2,
                                lineHeight: 1.2,
                                textAlign: { xs: 'center', md: 'left' },
                            }}
                        >
                            AI-powered GitHub collaboration
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                color: secondaryTextColor,
                                mb: 4,
                                fontWeight: 400,
                                textAlign: { xs: 'center', md: 'left' },
                            }}
                        >
                            Enhance your workflow with AI that understands your code,
                            streamlines reviews, and helps solve issues faster.
                        </Typography>

                        {/* Informação de permissão */}
                        <Box
                            sx={{
                                p: 2,
                                border: `1px solid ${borderColor}`,
                                borderRadius: 1,
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                                maxWidth: 'fit-content',
                                mx: { xs: 'auto', md: 0 },
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{ color: secondaryTextColor }}
                            >
                                GiTeam only requests necessary permissions to analyze your repositories.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Home;
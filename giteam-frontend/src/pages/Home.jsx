// import React from 'react';
// import {
//     Box,
//     Button,
//     Container,
//     Typography,
//     Paper,
//     Grid,
//     useTheme,
//     useMediaQuery,
//     Card,
//     CardContent,
//     Divider,
//     Stack
// } from '@mui/material';
// import GitHubIcon from '@mui/icons-material/GitHub';
// import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
// import CodeIcon from '@mui/icons-material/Code';
// import BugReportIcon from '@mui/icons-material/BugReport';
// import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
// import { loginWithGitHub } from '../services/auth';

// function Home() {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//     const isDarkMode = theme.palette.mode === 'dark';

//     const handleGitHubLogin = () => {
//         loginWithGitHub();
//     };

//     // Cores para manter consistência com o tema
//     const bgColor = theme.palette.background.default;
//     const paperBgColor = theme.palette.background.paper;
//     const primaryTextColor = theme.palette.text.primary;
//     const secondaryTextColor = theme.palette.text.secondary;
//     const borderColor = theme.palette.divider;
//     const primaryColor = theme.palette.primary.main;

//     // Features do produto
//     const features = [
//         {
//             icon: <CodeIcon sx={{ fontSize: 28, color: primaryColor }} />,
//             title: "Smart PR Reviews",
//             description: "Get AI-powered insights on your pull requests. Save time and catch issues before they reach production."
//         },
//         {
//             icon: <BugReportIcon sx={{ fontSize: 28, color: primaryColor }} />,
//             title: "Issue Analysis",
//             description: "Automatically analyze issues to identify patterns and suggest solutions, prioritizing what matters most."
//         },
//         {
//             icon: <AutoFixHighIcon sx={{ fontSize: 28, color: primaryColor }} />,
//             title: "Code Suggestions",
//             description: "Receive intelligent code recommendations that follow your team's patterns and best practices."
//         }
//     ];

//     return (
//         <Box
//             sx={{
//                 minHeight: '100vh',
//                 backgroundColor: bgColor,
//                 overflow: 'hidden',
//                 position: 'relative',
//             }}
//         >
//             {/* Gradient background accent */}
//             <Box
//                 sx={{
//                     position: 'absolute',
//                     top: 0,
//                     right: 0,
//                     width: { xs: '100%', md: '50%' },
//                     height: '100%',
//                     background: isDarkMode
//                         ? 'radial-gradient(circle at 70% 30%, rgba(46, 164, 79, 0.08) 0%, rgba(13, 17, 23, 0) 60%)'
//                         : 'radial-gradient(circle at 70% 30%, rgba(46, 164, 79, 0.05) 0%, rgba(248, 249, 250, 0) 60%)',
//                     zIndex: 0,
//                 }}
//             />

//             <Container
//                 maxWidth="xl"
//                 sx={{
//                     position: 'relative',
//                     zIndex: 1,
//                     pt: { xs: 4, md: 3 },
//                     pb: { xs: 4, md: 6 },
//                     minHeight: '100vh',
//                     display: 'flex',
//                     flexDirection: 'column',
//                 }}
//             >
//                 {/* Barra de navegação com logo e botão de login */}
//                 <Box
//                     sx={{
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         mb: { xs: 4, md: 6 },
//                         mt: 2,
//                     }}
//                 >
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <SmartToyOutlinedIcon
//                             sx={{
//                                 fontSize: 28,
//                                 mr: 1.5,
//                                 color: primaryColor,
//                             }}
//                         />
//                         <Typography
//                             variant="h6"
//                             fontWeight="600"
//                             sx={{ color: primaryTextColor }}
//                         >
//                             GiTeam
//                         </Typography>
//                     </Box>
                    
//                     {/* Botão de login no canto superior */}
//                     <Button
//                         variant="contained"
//                         size={isMobile ? "medium" : "large"}
//                         onClick={handleGitHubLogin}
//                         startIcon={<GitHubIcon />}
//                         sx={{
//                             backgroundColor: isDarkMode ? '#238636' : primaryColor,
//                             '&:hover': {
//                                 backgroundColor: isDarkMode ? '#2ea043' : '#218838',
//                             },
//                             py: isMobile ? 1 : 1.5,
//                             px: isMobile ? 2 : 3,
//                             fontSize: isMobile ? '0.875rem' : '1rem',
//                         }}
//                     >
//                         Sign in with GitHub
//                     </Button>
//                 </Box>

//                 {/* Conteúdo principal */}
//                 <Grid
//                     container
//                     spacing={4}
//                     sx={{
//                         alignItems: 'center',
//                         flexGrow: 1,
//                         flexDirection: { xs: 'column-reverse', md: 'row' },
//                     }}
//                 >
//                     {/* Esquerda - Features */}
//                     <Grid
//                         item
//                         xs={12}
//                         md={6}
//                         sx={{
//                             display: 'flex',
//                             flexDirection: 'column',
//                             alignItems: { xs: 'center', md: 'flex-start' },
//                             width: '100%',
//                         }}
//                     >
//                         <Card
//                             elevation={0}
//                             sx={{
//                                 width: '100%',
//                                 maxWidth: 500,
//                                 border: `1px solid ${borderColor}`,
//                                 borderRadius: 2,
//                                 overflow: 'hidden',
//                                 backgroundColor: paperBgColor,
//                                 mx: { xs: 'auto', md: 0 },
//                             }}
//                         >
//                             <Box
//                                 sx={{
//                                     p: 3,
//                                     borderBottom: `1px solid ${borderColor}`,
//                                     backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
//                                 }}
//                             >
//                                 <Typography variant="h6" fontWeight="600" sx={{ color: primaryTextColor }}>
//                                     Supercharge your GitHub workflow
//                                 </Typography>
//                             </Box>

//                             <Stack spacing={0} divider={<Divider />}>
//                                 {features.map((feature, index) => (
//                                     <Box key={index} sx={{ p: 3 }}>
//                                         <Box sx={{ display: 'flex', mb: 1 }}>
//                                             {feature.icon}
//                                             <Typography
//                                                 variant="subtitle1"
//                                                 fontWeight="600"
//                                                 sx={{ ml: 1.5, color: primaryTextColor }}
//                                             >
//                                                 {feature.title}
//                                             </Typography>
//                                         </Box>
//                                         <Typography variant="body2" sx={{ color: secondaryTextColor }}>
//                                             {feature.description}
//                                         </Typography>
//                                     </Box>
//                                 ))}
//                             </Stack>
//                         </Card>
//                     </Grid>

//                     {/* Direita - Conteúdo principal */}
//                     <Grid
//                         item
//                         xs={12}
//                         md={6}
//                         sx={{
//                             display: 'flex',
//                             flexDirection: 'column',
//                             justifyContent: 'center',
//                             mb: { xs: 4, md: 0 },
//                         }}
//                     >
//                         <Typography
//                             variant={isMobile ? "h3" : "h2"}
//                             component="h1"
//                             fontWeight="700"
//                             sx={{
//                                 color: primaryTextColor,
//                                 mb: 2,
//                                 lineHeight: 1.2,
//                                 textAlign: { xs: 'center', md: 'left' },
//                             }}
//                         >
//                             AI-powered GitHub collaboration
//                         </Typography>

//                         <Typography
//                             variant="h6"
//                             sx={{
//                                 color: secondaryTextColor,
//                                 mb: 4,
//                                 fontWeight: 400,
//                                 textAlign: { xs: 'center', md: 'left' },
//                             }}
//                         >
//                             Enhance your workflow with AI that understands your code,
//                             streamlines reviews, and helps solve issues faster.
//                         </Typography>

//                         {/* Informação de permissão */}
//                         <Box
//                             sx={{
//                                 p: 2,
//                                 border: `1px solid ${borderColor}`,
//                                 borderRadius: 1,
//                                 backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
//                                 maxWidth: 'fit-content',
//                                 mx: { xs: 'auto', md: 0 },
//                             }}
//                         >
//                             <Typography
//                                 variant="body2"
//                                 sx={{ color: secondaryTextColor }}
//                             >
//                                 GiTeam only requests necessary permissions to analyze your repositories.
//                             </Typography>
//                         </Box>
//                     </Grid>
//                 </Grid>
//             </Container>
//         </Box>
//     );
// }

// export default Home;

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container, Box, Typography, Button, useMediaQuery,
  Drawer, ButtonGroup, ThemeProvider, createTheme, CssBaseline,
  Card, CardActions, CardContent, CardMedia, IconButton
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { loginWithGitHub } from '../services/auth';
import aiImage from '../images/ai-hand.jpg';
import codeImage from '../images/code-anl.jpg';
import teamImage from '../images/team-work.jpg';

function Home() {
  const [mode, setMode] = useState('system');
  const [open, setOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const actualMode = useMemo(() => {
    if (mode === 'system') {
      return prefersDarkMode ? 'dark' : 'light';
    }
    return mode;
  }, [mode, prefersDarkMode]);

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: actualMode,
      },
    }), [actualMode]
  );

  const cards = [
    {
      title: "Smart PR Reviews",
      image: aiImage,
      description: "Get AI-powered insights on your pull requests. Save time and catch issues before they reach production."
    },
    {
      title: "Code Analysis",
      image: codeImage,
      description: "Automatic code quality checks and security scanning to identify potential bugs and vulnerabilities."
    },
    {
      title: "Team Collaboration",
      image: teamImage,
      description: "Enhance team workflows with AI-assisted issue summaries and documentation generation."
    }
  ];

  const CARD_WIDTH = 340;
  const CARD_HEIGHT = 300;

  const goToNextCard = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  }, [cards.length, isTransitioning]);

  const goToPrevCard = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentCardIndex((prevIndex) =>
        prevIndex === 0 ? cards.length - 1 : prevIndex - 1
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  }, [cards.length, isTransitioning]);

  const handleSetMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNextCard();
    }, 5000);
    return () => clearInterval(interval);
  }, [goToNextCard]);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleGitHubLogin = () => {
    loginWithGitHub();
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Container maxWidth={false} disableGutters
          sx={{
            minHeight: '10vh', width: '100vw', maxWidth: '100%', position: 'fixed',
            display: 'flex', top: 0, alignItems: 'center', justifyContent: 'space-between',
            bgcolor: theme.palette.background.paper, boxShadow: 1, zIndex: 1100
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', pl: '10px', height: '100%' }}>
            <SmartToyOutlinedIcon sx={{ fontSize: 28, mr: 1.5 }} />
            <Typography variant="h6" fontWeight="600">GiTeam</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', pr: '10px', height: '100%' }}>
            <SettingsSharpIcon
              color="inherit"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2, fontSize: 35, cursor: 'pointer' }}
            />

            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}
              PaperProps={{ sx: { width: '15vw', minWidth: '250px' } }}>
              <Typography variant="subtitle1" sx={{ pt: 2, pl: 2.5, fontWeight: 'bold', mb: 1 }}>Mode</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <ButtonGroup variant="outlined">
                  <Button onClick={() => handleSetMode('light')} variant={mode === 'light' ? 'contained' : 'outlined'}>Light</Button>
                  <Button onClick={() => handleSetMode('system')} variant={mode === 'system' ? 'contained' : 'outlined'}>System</Button>
                  <Button onClick={() => handleSetMode('dark')} variant={mode === 'dark' ? 'contained' : 'outlined'}>Dark</Button>
                </ButtonGroup>
              </Box>
            </Drawer>

            <Button
              variant="outlined"
              onClick={handleGitHubLogin}
              startIcon={<GitHubIcon />}
              sx={{
                color: "white", bgcolor: "black", py: isMobile ? 1 : 1.5, px: isMobile ? 2 : 3,
                fontSize: isMobile ? '0.875rem' : '1rem',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' }
              }}>
              Sign in
            </Button>
          </Box>
        </Container>

        <Box my={3} />

        <Container maxWidth={false} disableGutters sx={{ minHeight: 'calc(100vh - 10vh)', mt: '10vh', display: 'flex', flexDirection: 'row', p: 0 }}>
          <Box sx={{
            flex: 1,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.9)' : '#d0d0d0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', p: 3
          }}>
            <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>AI-powered GitHub collaboration</Typography>
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
              Enhance your workflow with AI that understands your code, streamlines reviews, and helps solve issues faster.
            </Typography>
          </Box>

          <Box sx={{
            flex: 1,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(50, 50, 50, 0.9)' : '#f0f0f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative'
          }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', px: 2, gap: 2 }}>
              <IconButton onClick={goToPrevCard} disabled={isTransitioning}
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.15)'
                  }
                }}>
                <ArrowBackIosIcon />
              </IconButton>

              <Box sx={{
                position: 'relative',
                width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT + 40}px`,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                overflow: 'visible', perspective: '1000px'
              }}>
                <Box sx={{ position: 'relative', width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px`, transition: 'transform 0.5s ease' }}>
                  <Card sx={{
                    width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px`,
                    boxShadow: 3, opacity: isTransitioning ? 0.5 : 1,
                    transition: 'opacity 0.5s ease', display: 'flex', flexDirection: 'column'
                  }}>
                    <CardMedia sx={{ height: 140 }} image={cards[currentCardIndex].image} title={cards[currentCardIndex].title} />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography gutterBottom variant="h5" component="div">{cards[currentCardIndex].title}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{cards[currentCardIndex].description}</Typography>
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 1, width: '100%' }}>
                  {cards.map((_, index) => (
                    <Box key={index} onClick={() => {
                      if (!isTransitioning && index !== currentCardIndex) {
                        setIsTransitioning(true);
                        setCurrentCardIndex(index);
                        setTimeout(() => setIsTransitioning(false), 500);
                      }
                    }} sx={{
                      width: 10, height: 10, borderRadius: '50%',
                      backgroundColor: index === currentCardIndex ? theme.palette.primary.main : theme.palette.grey[400],
                      mx: 0.5, cursor: 'pointer', transition: 'background-color 0.3s ease'
                    }} />
                  ))}
                </Box>
              </Box>

              <IconButton onClick={goToNextCard} disabled={isTransitioning}
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.15)'
                  }
                }}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default Home;

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Box, Typography, Button, useMediaQuery,
  ThemeProvider, CssBaseline, Divider,
  Card, CardContent, CardMedia, IconButton, useTheme,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { loginWithGitHub } from '../services/auth';
import aiImage from '../images/ai-hand.jpg';
import codeImage from '../images/code-anl.jpg';
import teamImage from '../images/team-work.jpg';
import { ThemeContext } from '../components/layout/Layout';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useLanguage } from '../contexts/LanguageContext';

function Home() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const theme = useTheme();
  const colorMode = React.useContext(ThemeContext);
  const { t } = useLanguage();
  

  const cards = [
    {
      title: t('CardTitle1'),
      image: aiImage,
      description: t('CardDesc1'),
    },
    {
      title: t('CardTitle2'),
      image: codeImage,
      description: t('CardDesc2')
    },
    {
      title: t('CardTitle3'),
      image: teamImage,
      description: t('CardDesc3')
    }
  ];

  const CARD_WIDTH = 400;
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

  useEffect(() => {
    const interval = setInterval(() => {
      goToNextCard();
    }, 10000);
    return () => clearInterval(interval);
  }, [goToNextCard]);


  const handleGitHubLogin = () => {
    loginWithGitHub();
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const primaryColor = theme.palette.primary.main;


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Container maxWidth={false} disableGutters
          sx={{
            minHeight: '10vh', width: '100vw', maxWidth: '100%', position: 'fixed',
            display: 'flex', top: 0, alignItems: 'center', justifyContent: 'space-between',
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', pl: '10px', height: '100%' }}>
            <SmartToyOutlinedIcon
              sx={{
                fontSize: 24,
                mr: 1,
                color: primaryColor
                }}
              />
            <Typography variant="h6" fontWeight="600">GiTeam</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', pr: '10px', height: '100%' }}>
            <LanguageSwitcher />
            
            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, my: 'auto' }} />

            <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{ mx: 1 }}>
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
                    
            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, my: 'auto' }} />
            

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
            flex: 3,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', p: 3,
            position: 'relative'
          }}>

            <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}
            >
              {t('homeTitle1')}           
            </Typography>

            <Typography variant="h5" sx={{ textAlign: 'center' }}>
            {t('homeTitle2')}
            </Typography>

          </Box>

          <Box sx={{
            flex: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative'
          }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', px: 2, gap: 2 }}>
              <IconButton onClick={goToPrevCard} disabled={isTransitioning}
                sx={{
                  '&:hover': { backgroundColor: 'transparent' },
                  '&:focus': { backgroundColor: 'transparent' },
                  '&:active': { backgroundColor: 'transparent' },
                }}
              >
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
                  '&:hover': { backgroundColor: 'transparent' },
                  '&:focus': { backgroundColor: 'transparent' },
                  '&:active': { backgroundColor: 'transparent' },
                }}
              >
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

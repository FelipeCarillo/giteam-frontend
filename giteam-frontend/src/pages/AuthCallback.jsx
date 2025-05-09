import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  Container,
  useTheme,
  Button,
  Fade
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';

import { handleAuthCallback } from '../services/auth';

function AuthCallback() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const bgColor = theme.palette.background.default;
  const cardBgColor = theme.palette.background.paper;
  const primaryTextColor = theme.palette.text.primary;
  const secondaryTextColor = theme.palette.text.secondary;
  const borderColor = theme.palette.divider;
  const primaryColor = theme.palette.primary.main;
  const errorColor = theme.palette.error.main;

  useEffect(() => {
    const processAuth = async () => {
      try {
        const response = await handleAuthCallback();
        if (!response) {
          throw new Error('No authentication token found');
        }

        setIsSuccess(true);

        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);

      } catch (err) {
        console.error('Authentication error:', err);
        setError(err.message);
      } finally {
        setIsProcessing(false);
      }
    };

    processAuth();
  }, []);

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Gradient background accent */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          background: isDarkMode
            ? 'radial-gradient(circle at 50% 30%, rgba(46, 164, 79, 0.08) 0%, rgba(13, 17, 23, 0) 70%)'
            : 'radial-gradient(circle at 50% 30%, rgba(46, 164, 79, 0.05) 0%, rgba(248, 249, 250, 0) 70%)',
          zIndex: 0,
        }}
      />

      {/* Logo at the top */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
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
      </Box>

      <Fade in={true} timeout={800}>
        <Container
          maxWidth="sm"
          sx={{
            position: 'relative',
            zIndex: 1
          }}
        >
          <Card
            elevation={0}
            sx={{
              overflow: 'hidden',
              borderRadius: 2,
              border: `1px solid ${borderColor}`,
              backgroundColor: cardBgColor,
            }}
          >
            <Box
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 320,
              }}
            >
              {isProcessing && (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 4,
                      position: 'relative'
                    }}
                  >
                    <CircularProgress
                      size={64}
                      thickness={3}
                      sx={{ color: primaryColor }}
                    />
                    <GitHubIcon
                      sx={{
                        position: 'absolute',
                        fontSize: 28,
                        color: primaryTextColor
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: primaryTextColor,
                      fontWeight: 600,
                      textAlign: 'center'
                    }}
                  >
                    Connecting with GitHub
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: secondaryTextColor,
                      textAlign: 'center',
                      maxWidth: '80%',
                      mx: 'auto'
                    }}
                  >
                    Please wait while we securely authenticate your account
                  </Typography>
                </>
              )}

              {isSuccess && !isProcessing && (
                <>
                  <CheckCircleOutlineIcon
                    sx={{
                      fontSize: 72,
                      color: primaryColor,
                      mb: 3
                    }}
                  />
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: primaryTextColor,
                      fontWeight: 600,
                      textAlign: 'center'
                    }}
                  >
                    Authentication Successful
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: secondaryTextColor,
                      mb: 3,
                      textAlign: 'center'
                    }}
                  >
                    Redirecting you to dashboard...
                  </Typography>
                  <CircularProgress
                    size={20}
                    thickness={4}
                    sx={{ color: secondaryTextColor, opacity: 0.5 }}
                  />
                </>
              )}

              {error && !isProcessing && (
                <>
                  <ErrorOutlineIcon
                    sx={{
                      fontSize: 72,
                      color: errorColor,
                      mb: 3
                    }}
                  />
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: primaryTextColor,
                      fontWeight: 600,
                      textAlign: 'center'
                    }}
                  >
                    Authentication Error
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: secondaryTextColor,
                      mb: 4,
                      p: 2,
                      backgroundColor: isDarkMode ? 'rgba(255,59,48,0.05)' : 'rgba(255,59,48,0.03)',
                      borderRadius: 1,
                      border: `1px solid ${isDarkMode ? 'rgba(255,59,48,0.1)' : 'rgba(255,59,48,0.08)'}`,
                      textAlign: 'center',
                      maxWidth: '85%'
                    }}
                  >
                    {error}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleReturnHome}
                    sx={{
                      mt: 1,
                      backgroundColor: isDarkMode ? '#238636' : primaryColor,
                      '&:hover': {
                        backgroundColor: isDarkMode ? '#2ea043' : '#218838',
                      },
                      px: 3,
                    }}
                  >
                    Return to Home
                  </Button>
                </>
              )}
            </Box>

            <Box
              sx={{
                p: 2,
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.01)',
                borderTop: `1px solid ${borderColor}`,
                textAlign: 'center'
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: secondaryTextColor }}
              >
                Secure connection via GitHub OAuth
              </Typography>
            </Box>
          </Card>
        </Container>
      </Fade>
    </Box>
  );
}

export default AuthCallback;
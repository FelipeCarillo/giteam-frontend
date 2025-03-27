import { createTheme } from '@mui/material/styles';

// Tema base com configurações compartilhadas
const baseTheme = {
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Inter',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 16px',
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          padding: '9px 15px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: '16px 0',
        },
      },
    },
  },
};

// Tema claro
export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#2ea44f', // GitHub green
      dark: '#218838',
      light: '#4cb96a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0366d6', // GitHub blue
      dark: '#0250a4',
      light: '#3d88e2',
    },
    background: {
      default: '#f8f9fa', // Mais suave que o anterior
      paper: '#ffffff',
    },
    text: {
      primary: '#202123', // OpenAI escuro
      secondary: '#6e6e80', // OpenAI cinza
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    action: {
      hover: 'rgba(0, 0, 0, 0.03)',
      selected: 'rgba(46, 164, 79, 0.08)',
    },
  },
});

// Tema escuro
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#2ea44f', // GitHub green
      dark: '#218838',
      light: '#4cb96a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#58a6ff', // GitHub blue (dark mode)
      dark: '#3993ff',
      light: '#79baff',
    },
    background: {
      default: '#0d1117', // GitHub dark
      paper: '#161b22', // Um pouco mais claro que o default
    },
    text: {
      primary: '#e1e1e6', // OpenAI claro
      secondary: '#acacbe', // OpenAI cinza claro
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    action: {
      hover: 'rgba(255, 255, 255, 0.05)',
      selected: 'rgba(46, 164, 79, 0.15)',
    },
  },
  components: {
    ...baseTheme.components,
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderColor: 'rgba(255, 255, 255, 0.12)',
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
        },
      },
    },
  },
});

export default lightTheme;
// App.js
import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import routes from './routes';
import { ThemeContext } from './components/layout/Layout';
import { LanguageProvider } from './contexts/LanguageContext';

// Componente que renderiza as rotas
const AppRoutes = () => {
  const routeElements = useRoutes(routes);
  return routeElements;
};

function App() {
  // Estado para controlar o modo escuro
  const [mode, setMode] = useState('light');

  // Verificar preferência de tema ao carregar
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setMode(savedDarkMode ? 'dark' : 'light');
  }, []);

  // Context para alternar o tema
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('darkMode', newMode === 'dark');
          return newMode;
        });
      },
    }),
    [],
  );

  // Criar o tema com base no modo atual
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#2ea44f',
          },
          background: {
            default: mode === 'dark' ? '#0d1117' : '#f6f8fa',
            paper: mode === 'dark' ? '#161b22' : '#ffffff',
          },
          text: {
            primary: mode === 'dark' ? '#f0f6fc' : '#24292e',
            secondary: mode === 'dark' ? '#8b949e' : '#57606a',
          },
        },
      }),
    [mode],
  );

  return (
    <LanguageProvider>
      <ThemeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ThemeProvider>
      </ThemeContext.Provider>
    </LanguageProvider>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { lightTheme, darkTheme } from './theme';
import routes from './routes';


function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');

    if (token) {
      localStorage.setItem('githubToken', token);

      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }

    setChecking(false);
  }, []);

  if (checking) {
    return null;
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
              exact={route.exact}
            />
          ))}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
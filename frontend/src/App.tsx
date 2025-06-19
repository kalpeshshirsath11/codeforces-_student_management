import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { StudentTable } from './components/StudentTable';
import { StudentProfile } from './components/StudentProfile';
import { CssBaseline, IconButton, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';

const ThemeToggle: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [darkMode, setDarkMode] = React.useState(isDark);

  React.useEffect(() => {
    setDarkMode(isDark);
  }, [isDark]);

  return (
    <IconButton
      sx={{ ml: 1 }}
      onClick={() => {
        localStorage.setItem('darkMode', JSON.stringify(!darkMode));
        window.location.reload();
      }}
      color="inherit"
    >
      {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <ThemeToggle />
        </Box>
        <Routes>
          <Route path="/" element={<StudentTable />} />
          <Route path="/student/:id" element={<StudentProfile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;

import React from 'react';
import { Container, ThemeProvider, createTheme } from '@mui/material';
import CryptoTracker from './components/CryptoTracker';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CryptoTracker />
    </ThemeProvider>
  );
}

export default App;

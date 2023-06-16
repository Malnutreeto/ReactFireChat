import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
//tema scuro
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme } from './components/Theme';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      < CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);



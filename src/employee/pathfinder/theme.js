import { createTheme } from '@mui/material/styles';

// MUI theme for the ported pathfinder workflow. Scoped to the pathfinder
// subtree via a local ThemeProvider (see PathfinderWorkflow.jsx) so it does not
// interfere with the rest of the Tailwind-styled employee panel.
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff6e9f',
      dark: '#c60055',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    background: {
      default: '#0a0e27',
      paper: '#1a1a2e',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
      active: 'rgba(255, 255, 255, 0.56)',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    h1: { fontWeight: 800, letterSpacing: '-0.5px' },
    h2: { fontWeight: 800, letterSpacing: '-0.5px' },
    h3: { fontWeight: 700, letterSpacing: '-0.5px' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.2)',
    '0px 4px 8px rgba(0,0,0,0.2)',
    '0px 6px 12px rgba(0,0,0,0.25)',
    '0px 8px 16px rgba(0,0,0,0.25)',
    '0px 10px 20px rgba(0,0,0,0.3)',
    '0px 12px 24px rgba(0,0,0,0.3)',
    '0px 14px 28px rgba(0,0,0,0.35)',
    '0px 16px 32px rgba(0,0,0,0.35)',
    '0px 18px 36px rgba(0,0,0,0.4)',
    '0px 20px 40px rgba(0,0,0,0.4)',
    '0px 22px 44px rgba(0,0,0,0.45)',
    '0px 24px 48px rgba(0,0,0,0.45)',
    '0px 26px 52px rgba(0,0,0,0.5)',
    '0px 28px 56px rgba(0,0,0,0.5)',
    '0px 30px 60px rgba(0,0,0,0.55)',
    '0px 32px 64px rgba(0,0,0,0.55)',
    '0px 34px 68px rgba(0,0,0,0.6)',
    '0px 36px 72px rgba(0,0,0,0.6)',
    '0px 38px 76px rgba(0,0,0,0.65)',
    '0px 40px 80px rgba(0,0,0,0.65)',
    '0px 42px 84px rgba(0,0,0,0.7)',
    '0px 44px 88px rgba(0,0,0,0.7)',
    '0px 46px 92px rgba(0,0,0,0.75)',
    '0px 48px 96px rgba(0,0,0,0.75)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.95rem',
        },
        contained: {
          boxShadow: '0 4px 12px rgba(33, 150, 243, 0.25)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(33, 150, 243, 0.35)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': { color: '#2196F3' },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, height: 8 },
      },
    },
  },
});

export default theme;

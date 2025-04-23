import { createTheme } from '@mui/material/styles';

// Light theme configuration
export const lightThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#8B5CF6', // Vivid purple
      light: '#D6BCFA',
      dark: '#6E59A5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0EA5E9', // Ocean blue
      light: '#D3E4FD',
      dark: '#0C84BA',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F1F0FB', // Soft gray
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1F2C', // Dark purple
      secondary: '#8E9196', // Neutral gray
    },
    error: {
      main: '#ea384c', // Red
    },
    warning: {
      main: '#F97316', // Bright orange
      light: '#FEC6A1',
    },
    info: {
      main: '#1EAEDB', // Bright blue
    },
    success: {
      main: '#7E69AB', // Secondary purple
      light: '#F2FCE2',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '0.875rem',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.05), 0px 1px 1px 0px rgba(0,0,0,0.03), 0px 1px 3px 0px rgba(0,0,0,0.01)',
    '0px 3px 1px -2px rgba(0,0,0,0.06), 0px 2px 2px 0px rgba(0,0,0,0.04), 0px 1px 5px 0px rgba(0,0,0,0.02)',
    '0px 3px 3px -2px rgba(0,0,0,0.07), 0px 3px 4px 0px rgba(0,0,0,0.05), 0px 1px 8px 0px rgba(0,0,0,0.03)',
    '0px 2px 4px -1px rgba(0,0,0,0.08), 0px 4px 5px 0px rgba(0,0,0,0.06), 0px 1px 10px 0px rgba(0,0,0,0.04)',
    '0px 3px 5px -1px rgba(0,0,0,0.09), 0px 5px 8px 0px rgba(0,0,0,0.07), 0px 1px 14px 0px rgba(0,0,0,0.05)',
    '0px 3px 5px -1px rgba(0,0,0,0.1), 0px 6px 10px 0px rgba(0,0,0,0.08), 0px 1px 18px 0px rgba(0,0,0,0.06)',
    '0px 4px 5px -2px rgba(0,0,0,0.11), 0px 7px 10px 1px rgba(0,0,0,0.09), 0px 2px 16px 1px rgba(0,0,0,0.07)',
    '0px 5px 5px -3px rgba(0,0,0,0.12), 0px 8px 10px 1px rgba(0,0,0,0.1), 0px 3px 14px 2px rgba(0,0,0,0.08)',
    '0px 5px 6px -3px rgba(0,0,0,0.13), 0px 9px 12px 1px rgba(0,0,0,0.11), 0px 3px 16px 2px rgba(0,0,0,0.09)',
    '0px 6px 6px -3px rgba(0,0,0,0.14), 0px 10px 14px 1px rgba(0,0,0,0.12), 0px 4px 18px 3px rgba(0,0,0,0.1)',
    '0px 6px 7px -4px rgba(0,0,0,0.15), 0px 11px 15px 1px rgba(0,0,0,0.13), 0px 4px 20px 3px rgba(0,0,0,0.11)',
    '0px 7px 8px -4px rgba(0,0,0,0.16), 0px 12px 17px 2px rgba(0,0,0,0.14), 0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.17), 0px 13px 19px 2px rgba(0,0,0,0.15), 0px 5px 24px 4px rgba(0,0,0,0.13)',
    '0px 7px 9px -4px rgba(0,0,0,0.18), 0px 14px 21px 2px rgba(0,0,0,0.16), 0px 5px 26px 4px rgba(0,0,0,0.14)',
    '0px 8px 9px -5px rgba(0,0,0,0.19), 0px 15px 22px 2px rgba(0,0,0,0.17), 0px 6px 28px 5px rgba(0,0,0,0.15)',
    '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.18), 0px 6px 30px 5px rgba(0,0,0,0.16)',
    '0px 8px 11px -5px rgba(0,0,0,0.21), 0px 17px 26px 2px rgba(0,0,0,0.19), 0px 6px 32px 5px rgba(0,0,0,0.17)',
    '0px 9px 11px -5px rgba(0,0,0,0.22), 0px 18px 28px 2px rgba(0,0,0,0.2), 0px 7px 34px 6px rgba(0,0,0,0.18)',
    '0px 9px 12px -6px rgba(0,0,0,0.23), 0px 19px 29px 2px rgba(0,0,0,0.21), 0px 7px 36px 6px rgba(0,0,0,0.19)',
    '0px 10px 13px -6px rgba(0,0,0,0.24), 0px 20px 31px 3px rgba(0,0,0,0.22), 0px 8px 38px 7px rgba(0,0,0,0.2)',
    '0px 10px 13px -6px rgba(0,0,0,0.25), 0px 21px 33px 3px rgba(0,0,0,0.23), 0px 8px 40px 7px rgba(0,0,0,0.21)',
    '0px 10px 14px -6px rgba(0,0,0,0.26), 0px 22px 35px 3px rgba(0,0,0,0.24), 0px 8px 42px 7px rgba(0,0,0,0.22)',
    '0px 11px 14px -7px rgba(0,0,0,0.27), 0px 23px 36px 3px rgba(0,0,0,0.25), 0px 9px 44px 8px rgba(0,0,0,0.23)',
    '0px 11px 15px -7px rgba(0,0,0,0.28), 0px 24px 38px 3px rgba(0,0,0,0.26), 0px 9px 46px 8px rgba(0,0,0,0.24)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          ':hover': {
            boxShadow: '0px 4px 8px rgba(139, 92, 246, 0.15)',
          },
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(139, 92, 246, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
};

// Dark theme configuration
export const darkThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#9b87f5', // Primary purple (lighter for dark mode)
      light: '#E5DEFF',
      dark: '#7E69AB',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#33C3F0', // Sky blue
      light: '#B3E0F2',
      dark: '#0EA5E9',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#1A1F2C', // Dark purple
      paper: '#222222', // Dark gray
    },
    text: {
      primary: '#F6F6F7', // Light gray
      secondary: '#C8C8C9', // Light gray
    },
    error: {
      main: '#ea384c', // Red
    },
    warning: {
      main: '#FEC6A1', // Soft orange
      light: '#FDE1D3',
    },
    info: {
      main: '#33C3F0', // Sky blue
    },
    success: {
      main: '#D6BCFA', // Light purple
      light: '#E5DEFF',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '0.875rem',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2), 0px 9px 12px 1px rgba(0,0,0,0.14), 0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2), 0px 10px 14px 1px rgba(0,0,0,0.14), 0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2), 0px 11px 15px 1px rgba(0,0,0,0.14), 0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2), 0px 12px 17px 2px rgba(0,0,0,0.14), 0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2), 0px 13px 19px 2px rgba(0,0,0,0.14), 0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2), 0px 14px 21px 2px rgba(0,0,0,0.14), 0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2), 0px 15px 22px 2px rgba(0,0,0,0.14), 0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2), 0px 17px 26px 2px rgba(0,0,0,0.14), 0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2), 0px 18px 28px 2px rgba(0,0,0,0.14), 0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2), 0px 19px 29px 2px rgba(0,0,0,0.14), 0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2), 0px 20px 31px 3px rgba(0,0,0,0.14), 0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2), 0px 21px 33px 3px rgba(0,0,0,0.14), 0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2), 0px 22px 35px 3px rgba(0,0,0,0.14), 0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2), 0px 23px 36px 3px rgba(0,0,0,0.14), 0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          ':hover': {
            boxShadow: '0px 4px 8px rgba(155, 135, 245, 0.25)',
          },
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(155, 135, 245, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
        },
      },
    },
  },
};

// Create theme function that can be used to initialize the theme
export function createMuiTheme(mode) {
  return createTheme(mode === 'light' ? lightThemeOptions : darkThemeOptions);
}
import { alpha, createTheme } from '@mui/material/styles';

const glass = (bg = '#0B1220') => ({
  backgroundColor: alpha('#FFFFFF', 0.04),
  backdropFilter: 'blur(10px) saturate(140%)',
  border: '1px solid ' + alpha('#FFFFFF', 0.08),
});

export default createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3B82F6' }, // blue-500
    secondary: { main: '#22D3EE' }, // cyan-400
    background: {
      default: '#0A0F1A',  // page
      paper: '#0F172A',    // cards (will be overridden by glass)
    },
  },
  shape: { borderRadius: 14 },
  shadows: [
    'none',
    '0 4px 16px rgba(0,0,0,.25)',
    ...Array(23).fill('0 10px 30px rgba(0,0,0,.35)')
  ],
  components: {
    MuiPaper: {
      styleOverrides: { root: glass() }
    },
    MuiDialog: {
      styleOverrides: {
        paper: { ...glass(), borderRadius: 20 }
      }
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600
        },
        containedPrimary: {
          background: 'linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: alpha('#FFFFFF', 0.03),
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#FFFFFF', 0.25)
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 3px ${alpha('#3B82F6', 0.25)}`
          }
        })
      }
    },
    MuiChip: {
      styleOverrides: {
        root: ({ ownerState, theme }) => {
          // Only apply glass to "default" chips (e.g., provider)
          if (ownerState.color === 'default') {
            return {
              backgroundColor: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(10px) saturate(140%)',
              border: '1px solid rgba(255,255,255,0.08)'
            };
          }
          // Let success/error/warning use their real colors
          return {};
        }
      }
    }
  }
});

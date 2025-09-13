import { createTheme } from '@mui/material/styles'

export default createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3B82F6' },  // blue
    background: {
      default: '#0F172A', // slate-900
      paper: '#111827'    // gray-900
    }
  },
  shape: { borderRadius: 12 }
})

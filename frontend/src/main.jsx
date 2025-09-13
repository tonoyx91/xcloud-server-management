import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, CssBaseline } from '@mui/material'
import App from './App'
import theme from './theme'
import NotifyProvider from './notify'

const qc = new QueryClient()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={qc}>
        <NotifyProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </NotifyProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
)

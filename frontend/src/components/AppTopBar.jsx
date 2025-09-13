import { AppBar, Toolbar, Box, Typography, IconButton, Button } from '@mui/material'
import CloudIcon from '@mui/icons-material/Cloud'
import LogoutIcon from '@mui/icons-material/Logout'

export default function AppTopBar({ onLogout }) {
    return (
        <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <Toolbar sx={{ gap: 2 }}>
                <CloudIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>xCloud Prototype</Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* <Button color="inherit" size="small">Dashboard</Button>
          <Button color="inherit" size="small" variant="outlined">Servers</Button>
          <Button color="inherit" size="small">Sites</Button> */}
                    <IconButton
                        onClick={onLogout}
                        sx={{
                            // normal state
                            color: 'inherit',
                            // hover state
                            '&:hover': {
                                color: 'error.main',      // theme red
                                // backgroundColor: 'transparent', // uncomment if you don't want the gray hover bg
                            },
                        }}
                    >
                        <LogoutIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

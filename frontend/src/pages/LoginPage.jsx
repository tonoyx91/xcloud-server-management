import { useState } from 'react';
import {
  Box, Container, Paper, TextField, Typography, IconButton, InputAdornment, Button
} from '@mui/material';
import CloudRounded from '@mui/icons-material/CloudRounded';
import PersonOutline from '@mui/icons-material/PersonOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlined from '@mui/icons-material/LockOutlined';
import LoginRounded from '@mui/icons-material/LoginRounded';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [usernameOrEmail, setU] = useState('admin');
  const [password, setP] = useState('admin123');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    setErr('');
    try{
      const { data } = await api.post('/auth/login', { usernameOrEmail, password });
      localStorage.setItem('token', data.token);
      nav('/');
    }catch(e){ setErr(e.response?.data?.error || 'Login failed'); }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `radial-gradient(1200px 600px at -10% -10%, #1d4ed8 0%, transparent 60%),
                   radial-gradient(1200px 600px at 110% -10%, #8b5cf6 0%, transparent 60%),
                   radial-gradient(1200px 600px at 50% 120%, #06b6d4 0%, transparent 60%),
                   #0A0F1A`,
      display:'grid', placeItems:'center', p: 2
    }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:1, mb: .5 }}>
            <CloudRounded color="primary" sx={{ fontSize: 32 }}/>
            <Typography variant="h5" fontWeight={800}>xCloud — Sign in</Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: .7, mb: 3 }}>
            Welcome back! Use your admin credentials to manage servers.
          </Typography>

          <Box component="form" onSubmit={submit} sx={{ display:'grid', gap: 2 }}>
            <TextField
              label="Username or Email"
              value={usernameOrEmail} onChange={e=>setU(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonOutline/></InputAdornment>
              }}
              autoFocus
            />

            <TextField
              label="Password" type={show?'text':'password'}
              value={password} onChange={e=>setP(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockOutlined/></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={()=>setShow(s=>!s)} edge="end">
                      {show ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {err && <Typography color="error" variant="body2">{err}</Typography>}

            <Button type="submit" variant="contained" size="large"
              startIcon={<LoginRounded/>}>
              Sign in
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

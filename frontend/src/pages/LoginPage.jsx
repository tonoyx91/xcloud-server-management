import { useState } from 'react'
import { Container, Box, Paper, TextField, Button, Typography } from '@mui/material'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [usernameOrEmail, setU] = useState('admin')
  const [password, setP] = useState('admin123')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setErr('')
    try {
      const { data } = await api.post('/auth/login', { usernameOrEmail, password })
      localStorage.setItem('token', data.token)
      nav('/')
    } catch (e) {
      setErr(e.response?.data?.error || 'Login failed')
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight:700 }}>Login</Typography>
        <Box component="form" onSubmit={submit} sx={{ display:'grid', gap:2 }}>
          <TextField label="Username or Email" value={usernameOrEmail} onChange={e=>setU(e.target.value)} autoFocus />
          <TextField label="Password" type="password" value={password} onChange={e=>setP(e.target.value)} />
          {err && <Typography color="error" variant="body2">{err}</Typography>}
          <Button type="submit" variant="contained">Sign In</Button>
        </Box>
      </Paper>
    </Container>
  )
}

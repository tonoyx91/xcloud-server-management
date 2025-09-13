import { useEffect, useMemo, useState } from 'react'
import {
  Container, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box,
  Grid, Button, Tabs, Tab, Typography, TableContainer
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import AppTopBar from '../components/AppTopBar'
import FiltersBar from '../components/FiltersBar'
import ServerFormDialog from '../components/ServerFormDialog'
import ServerRow from '../components/ServerRow'
import ServerCard from '../components/ServerCard'
import { useServers } from '../hooks/useServers'
import api from '../api'
import { useSnackbar } from '../notify'
import WelcomeDialog from '../components/WelcomeDialog'


export default function ServersPage() {
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('')
  const [provider, setProvider] = useState('all')
  const [status, setStatus] = useState('all')
  const [sortBy, setSortBy] = useState('status')
  const [page, setPage] = useState(1)
  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [selected, setSelected] = useState(new Set())

  const params = useMemo(() => ({
    page, limit: 10, search, provider, status, sortBy, sortOrder: 'desc'
  }), [page, search, provider, status, sortBy])

  const { data, isLoading, refetch } = useServers(params)
  const servers = data?.data || []
  const pages = data?.pagination?.pages || 1

  const loc = useLocation();
  const nav = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const flash = loc.state?.flash;

  // open the pretty dialog when we land here after login 
  useEffect(() => {
    if (flash?.type === 'welcome') {
      setWelcomeOpen(true);
      // clear state so refresh won't reopen 
      window.history.replaceState({}, document.title);
    }
  }, []);

  const openCreate = () => { setEditing(null); setOpenForm(true) }
  const openEdit = (s) => { setEditing(s); setOpenForm(true) }
  const onSaved = () => {
    setOpenForm(false);
    enqueueSnackbar(editing?._id ? 'Server updated' : 'Server created', { variant: 'success' });
    refetch();
  }

  async function remove(id) {
    await api.delete(`/servers/${id}`);
    enqueueSnackbar('Server deleted', { variant: 'error' });
    refetch();
  }
  async function bulkDelete() {
    if (!selected.size) return
    await api.post('/servers/bulk-delete', { ids: [...selected] })
    setSelected(new Set()); refetch()
    enqueueSnackbar('Bulk delete completed', { variant: 'error' })
  }
  function toggleSel(id, checked) {
    const cp = new Set(selected)
    checked ? cp.add(id) : cp.delete(id)
    setSelected(cp)
  }
  useEffect(() => { setPage(1) }, [search, provider, status, sortBy])

  return (
    <>
      <AppTopBar onLogout={() => {
        localStorage.removeItem('token');
        nav('/login', { state: { flash: { type: 'logout', message: 'Logged out successfully' } } });
      }} />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 800 }}>All Servers</Typography>

        <FiltersBar
          search={search} setSearch={setSearch}
          provider={provider} setProvider={setProvider}
          status={status} setStatus={setStatus}
          sortBy={sortBy} setSortBy={setSortBy}
          onSearch={() => refetch()}
          onOpenCreate={openCreate}
        />

        <Tabs value={view} onChange={(_, v) => setView(v)} sx={{ mb: 2 }}>
          <Tab label="GRID" value="grid" />
          <Tab label="LIST" value="list" />
        </Tabs>

        {isLoading ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>Loading...</Paper>
        ) : servers.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Welcome to the xCloud Prototype! Host you own Server!</Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.7 }}>You have no server yet.</Typography>

            <Button variant="contained" onClick={openCreate}>Add New Server</Button>
          </Paper>
        ) : view === 'list' ? (
          <>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="error" disabled={!selected.size} onClick={bulkDelete}>
                Bulk Delete ({selected.size})
              </Button>
            </Box>

            <TableContainer component={Paper}
              sx={{
                borderRadius: 1,
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,.35)'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
                  }}>
                    <TableCell width={42}></TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>IP</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Provider</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>CPU</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>RAM (MB)</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Storage (GB)</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody sx={{
                  '& tr:nth-of-type(even) td': { backgroundColor: 'rgba(255,255,255,0.02)' },
                  '& td, & th': { borderColor: 'rgba(255,255,255,0.06)' }
                }}>
                  {servers.map(s => (
                    <ServerRow
                      key={s._id}
                      s={s}
                      onEdit={openEdit}
                      onDelete={remove}
                      selectable={selected}
                      onToggle={toggleSel}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', gap: 1, p: 2, justifyContent: 'center' }}>
              <Button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <Box sx={{ alignSelf: 'center' }}>Page {page}/{pages}</Box>
              <Button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="error" disabled={!selected.size} onClick={bulkDelete}>
                Bulk Delete ({selected.size})
              </Button>
            </Box>

            <Grid container spacing={2}>
              {servers.map(s => (
                <Grid key={s._id} item xs={12} sm={6} md={4}>
                  <ServerCard
                    s={s}
                    onEdit={openEdit}
                    onDelete={remove}
                    selectable={selected}
                    onToggle={toggleSel}
                  />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', gap: 1, p: 2, justifyContent: 'center' }}>
              <Button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <Box sx={{ alignSelf: 'center' }}>Page {page}/{pages}</Box>
              <Button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </Box>
          </>
        )}

        <ServerFormDialog
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSaved={onSaved}
          editing={editing}
        />
        <WelcomeDialog
          open={welcomeOpen}
          onClose={() => setWelcomeOpen(false)}
          title={flash?.title}
          subtitle={flash?.subtitle}
        />
      </Container>
    </>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Container, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Grid, Button, Tabs, Tab, Typography } from '@mui/material'
import AppTopBar from '../components/AppTopBar'
import FiltersBar from '../components/FiltersBar'
import ServerFormDialog from '../components/ServerFormDialog'
import ServerRow from '../components/ServerRow'
import ServerCard from '../components/ServerCard'
import { useServers } from '../hooks/useServers'
import api from '../api'

export default function ServersPage() {
  const [view, setView] = useState('list')  // 'list' | 'grid'
  const [search, setSearch] = useState('')
  const [provider, setProvider] = useState('all')
  const [status, setStatus] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [page, setPage] = useState(1)
  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [selected, setSelected] = useState(new Set())

  const params = useMemo(() => ({
    page, limit: 10, search,
    provider, status, sortBy, sortOrder: 'desc'
  }), [page, search, provider, status, sortBy])

  const { data, isLoading, refetch } = useServers(params)
  const servers = data?.data || []
  const pages = data?.pagination?.pages || 1

  const openCreate = () => { setEditing(null); setOpenForm(true) }
  const openEdit = (s) => { setEditing(s); setOpenForm(true) }
  const onSaved = () => { setOpenForm(false); refetch() }

  async function remove(id) {
    await api.delete(`/servers/${id}`); refetch()
  }

  async function bulkDelete() {
    if (!selected.size) return
    await api.post('/servers/bulk-delete', { ids: [...selected] })
    setSelected(new Set()); refetch()
  }

  function toggleSel(id, checked) {
    const cp = new Set(selected)
    checked ? cp.add(id) : cp.delete(id)
    setSelected(cp)
  }

  useEffect(() => { setPage(1) }, [search, provider, status, sortBy])

  return (
    <>
      <AppTopBar onLogout={() => { localStorage.removeItem('token'); location.href='/login' }} />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>All Servers</Typography>

        <FiltersBar
          search={search} setSearch={setSearch}
          provider={provider} setProvider={setProvider}
          status={status} setStatus={setStatus}
          sortBy={sortBy} setSortBy={setSortBy}
          onSearch={() => refetch()}
          onOpenCreate={openCreate}
        />

        <Tabs value={view} onChange={(_,v)=>setView(v)} sx={{ mb:2 }}>
          <Tab label="Grid" value="grid" />
          <Tab label="List" value="list" />
        </Tabs>

        {isLoading ? (
          <Paper sx={{ p: 6, textAlign:'center' }}>Loading...</Paper>
        ) : servers.length === 0 ? (
          <Paper sx={{ p: 6, textAlign:'center' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Hey there! You have no server yet.</Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
              Check out our Quick Start Documentation.
            </Typography>
            <Button variant="contained" onClick={openCreate}>Add New Server</Button>
          </Paper>
        ) : view === 'list' ? (
          <Paper>
            <Box sx={{ p: 1, display:'flex', gap:1, justifyContent:'flex-end' }}>
              <Button variant="outlined" disabled={!selected.size} onClick={bulkDelete}>
                Bulk Delete ({selected.size})
              </Button>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={42}></TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>IP</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>CPU</TableCell>
                  <TableCell>RAM (MB)</TableCell>
                  <TableCell>Storage (GB)</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {servers.map(s => (
                  <ServerRow key={s._id}
                    s={s}
                    onEdit={openEdit}
                    onDelete={remove}
                    selectable={selected}
                    onToggle={toggleSel}
                  />
                ))}
              </TableBody>
            </Table>

            <Box sx={{ display:'flex', gap:1, p:2, justifyContent:'center' }}>
              <Button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</Button>
              <Box sx={{ alignSelf:'center' }}>Page {page}/{pages}</Box>
              <Button disabled={page>=pages} onClick={()=>setPage(p=>p+1)}>Next</Button>
            </Box>
          </Paper>
        ) : (
          <>
            <Box sx={{ display:'flex', gap:1, mb:1, justifyContent:'flex-end' }}>
              <Button variant="outlined" disabled={!selected.size} onClick={bulkDelete}>
                Bulk Delete ({selected.size})
              </Button>
            </Box>
            <Grid container spacing={2}>
              {servers.map(s => (
                <Grid key={s._id} item xs={12} sm={6} md={4}>
                  <ServerCard s={s}
                    onEdit={openEdit}
                    onDelete={remove}
                    selectable={selected}
                    onToggle={toggleSel}
                  />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display:'flex', gap:1, p:2, justifyContent:'center' }}>
              <Button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</Button>
              <Box sx={{ alignSelf:'center' }}>Page {page}/{pages}</Box>
              <Button disabled={page>=pages} onClick={()=>setPage(p=>p+1)}>Next</Button>
            </Box>
          </>
        )}

        <ServerFormDialog
          open={openForm}
          onClose={()=>setOpenForm(false)}
          onSaved={onSaved}
          editing={editing}
        />
      </Container>
    </>
  )
}

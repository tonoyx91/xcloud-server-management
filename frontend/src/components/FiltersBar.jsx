import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

export default function FiltersBar({
  search, setSearch,
  provider, setProvider,
  status, setStatus,
  sortBy, setSortBy,
  onSearch, onOpenCreate
}) {
  return (
    <Box sx={{ display:'grid', gridTemplateColumns:'1fr repeat(4,180px) auto', gap:2, mb:2 }}>
      <TextField size="small" label="Search sites..." value={search} onChange={e=>setSearch(e.target.value)} />

      <FormControl size="small">
        <InputLabel>Filter by Provider</InputLabel>
        <Select label="Filter by Provider" value={provider} onChange={e=>setProvider(e.target.value)}>
          <MenuItem value="all">All Providers</MenuItem>
          <MenuItem value="aws">AWS</MenuItem>
          <MenuItem value="digitalocean">DigitalOcean</MenuItem>
          <MenuItem value="vultr">Vultr</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small">
        <InputLabel>Status</InputLabel>
        <Select label="Status" value={status} onChange={e=>setStatus(e.target.value)}>
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="maintenance">Maintenance</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small">
        <InputLabel>Sort By</InputLabel>
        <Select label="Sort By" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <MenuItem value="createdAt">Created</MenuItem>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="provider">Provider</MenuItem>
          <MenuItem value="status">Status</MenuItem>
        </Select>
      </FormControl>

      <Button variant="outlined" onClick={onSearch}>Apply</Button>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onOpenCreate}>Add New Server</Button>
    </Box>
  )
}

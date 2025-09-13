import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, MenuItem, Box, Typography, Tooltip, InputAdornment
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import AddCircleRounded from '@mui/icons-material/AddCircleRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import PublicRounded from '@mui/icons-material/PublicRounded';
import DnsRounded from '@mui/icons-material/DnsRounded';
import MemoryRounded from '@mui/icons-material/MemoryRounded';
import SdStorageRounded from '@mui/icons-material/SdStorageRounded';
import ComputerRounded from '@mui/icons-material/ComputerRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import RocketLaunchRounded from '@mui/icons-material/RocketLaunchRounded';

import api from '../api';

const empty = { name:'', ip_address:'', provider:'aws', status:'inactive', cpu_cores:1, ram_mb:512, storage_gb:10 };

export default function ServerFormDialog({ open, onClose, onSaved, editing }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { setForm(editing ? { ...editing } : empty); setErr(''); }, [editing, open]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function save() {
    setSaving(true); setErr('');
    try {
      if (editing?._id) await api.put(`/servers/${editing._id}`, form);
      else await api.post('/servers', form);
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.message || e.response?.data?.error || 'Save failed');
    } finally { setSaving(false); }
  }

  const TitleIcon = editing?._id ? EditRounded : AddCircleRounded;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {/* Gradient header */}
      <Box sx={{
        px: 3, pt: 2, pb: 2,
        background: 'linear-gradient(135deg,#0EA5E9 0%,#6366F1 60%,#8B5CF6 100%)',
        color: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20
      }}>
        <DialogTitle sx={{ p: 0, display:'flex', gap:1.5, alignItems:'center' }}>
          <TitleIcon />
          <Typography variant="h6" fontWeight={800}>
            {editing?._id ? 'Edit Server' : 'Add New Server'}
          </Typography>
        </DialogTitle>
        <Typography variant="body2" sx={{ opacity: .9 }}>
          Define a server’s identity and resources. All validations are enforced.
        </Typography>
      </Box>

      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Name" value={form.name}
              onChange={e=>set('name', e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><ComputerRounded/></InputAdornment> }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="IP Address" value={form.ip_address}
              onChange={e=>set('ip_address', e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><PublicRounded/></InputAdornment> }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField select fullWidth label="Provider" value={form.provider}
              onChange={e=>set('provider', e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><DnsRounded/></InputAdornment> }}
            >
              <MenuItem value="aws">AWS</MenuItem>
              <MenuItem value="digitalocean">DigitalOcean</MenuItem>
              <MenuItem value="vultr">Vultr</MenuItem>
              <MenuItem value="Hostinger">Hostinger</MenuItem>
              <MenuItem value="Linode">Linode</MenuItem>
              <MenuItem value="AWS">AWS</MenuItem>
              <MenuItem value="Google Cloud">Google Cloud</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField select fullWidth label="Status" value={form.status}
              onChange={e=>set('status', e.target.value)}
            >
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField fullWidth type="number" label="CPU Cores" value={form.cpu_cores}
              onChange={e=>set('cpu_cores', Number(e.target.value))}
              InputProps={{ startAdornment: <InputAdornment position="start"><ComputerRounded/></InputAdornment> }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth type="number" label="RAM (MB)" value={form.ram_mb}
              onChange={e=>set('ram_mb', Number(e.target.value))}
              InputProps={{ startAdornment: <InputAdornment position="start"><MemoryRounded/></InputAdornment> }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth type="number" label="Storage (GB)" value={form.storage_gb}
              onChange={e=>set('storage_gb', Number(e.target.value))}
              InputProps={{ startAdornment: <InputAdornment position="start"><SdStorageRounded/></InputAdornment> }}
            />
          </Grid>
        </Grid>

        {err && <Box sx={{ mt: 2, color: 'salmon', fontWeight: 600 }}>{err}</Box>}

        {/* live summary pills */}
        <Box sx={{ mt: 2, display:'flex', gap:1, flexWrap:'wrap' }}>
          <Tooltip title="Total cores"><Box sx={{ px:1.2, py:.7, borderRadius: 999, bgcolor: 'primary.main', color: '#fff' }}>{form.cpu_cores} cores</Box></Tooltip>
          <Tooltip title="RAM in MB"><Box sx={{ px:1.2, py:.7, borderRadius: 999, bgcolor: 'secondary.main', color: '#001827' }}>{form.ram_mb} MB</Box></Tooltip>
          <Tooltip title="Storage in GB"><Box sx={{ px:1.2, py:.7, borderRadius: 999, bgcolor: 'success.main', color: '#001a0a' }}>{form.storage_gb} GB</Box></Tooltip>
          <Tooltip title="Provider"><Box sx={{ px:1.2, py:.7, borderRadius: 999, border:'1px solid', borderColor:'divider' }}>{form.provider}</Box></Tooltip>
          <Tooltip title="Status"><Box sx={{ px:1.2, py:.7, borderRadius: 999, border:'1px solid', borderColor:'divider' }}>{form.status}</Box></Tooltip>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button startIcon={<CloseRounded/>} onClick={onClose}>Cancel</Button>
        <LoadingButton loading={saving} variant="contained" onClick={save}
          startIcon={<RocketLaunchRounded/>}>
          {editing?._id ? 'Update' : 'Create'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

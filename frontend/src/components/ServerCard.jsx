import {
  Card, CardContent, CardHeader, Typography, Chip, Box, IconButton, Stack
} from '@mui/material';
import EditRounded from '@mui/icons-material/EditRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import StorageRounded from '@mui/icons-material/Storage';

function statusColor(status) {
  if (status === 'active') return 'success';
  if (status === 'inactive') return 'error';
  return 'warning';
}

export default function ServerCard({ s, onEdit, onDelete, onToggle, selectable }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        transition: 'transform .16s ease, box-shadow .16s ease, border-color .16s ease',
        borderColor: 'rgba(255,255,255,0.08)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 20px 60px rgba(0,0,0,.35)',
          borderColor: 'rgba(59,130,246,.45)'
        }
      }}
    >
      <CardHeader
        avatar={
          <input
            type="checkbox"
            checked={selectable?.has(s._id) || false}
            onChange={e => onToggle?.(s._id, e.target.checked)}
          />
        }
        action={
          <Stack direction="row" spacing={0.5}>
            <IconButton color="primary" onClick={() => onEdit(s)}><EditRounded/></IconButton>
            <IconButton color="error" onClick={() => onDelete(s._id)}><DeleteRounded/></IconButton>
          </Stack>
        }
        title={<Typography variant="subtitle1" fontWeight={800}>{s.name}</Typography>}
        subheader={<Typography variant="caption" color="text.secondary">{s.ip_address}</Typography>}
        sx={{ pb: 0.5 }}
      />

      <CardContent sx={{ pt: 1.5 }}>
        <Box sx={{ display:'flex', gap:1, mb:1, alignItems:'center', opacity:.95 }}>
          <StorageRounded fontSize="small" />
          <Typography variant="body2">
            {s.cpu_cores} cores · {s.ram_mb} MB · {s.storage_gb} GB
          </Typography>
        </Box>

        <Box sx={{ display:'flex', gap:1, flexWrap:'wrap' }}>
          <Chip size="small" label={s.provider} sx={{ textTransform:'lowercase' }} />
          <Chip
            size="small"
            label={s.status}
            color={s.status === 'active' ? 'success' : s.status === 'inactive' ? 'error' : 'warning'}
            variant="filled"
            sx={{ textTransform:'lowercase', fontWeight:700 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

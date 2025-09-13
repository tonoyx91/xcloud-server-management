import { IconButton, TableRow, TableCell, Chip, Tooltip, Stack } from '@mui/material';
import EditRounded from '@mui/icons-material/EditRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';

function statusColor(status) {
  if (status === 'active') return 'success';      // green
  if (status === 'inactive') return 'error';      // red
  return 'warning';                               // maintenance = amber
}

export default function ServerRow({ s, onEdit, onDelete, selectable, onToggle }) {
  return (
    <TableRow hover sx={{ '&:hover td': { backgroundColor: 'rgba(255,255,255,0.015)' } }}>
      <TableCell width={42}>
        <input
          type="checkbox"
          checked={selectable?.has(s._id) || false}
          onChange={e => onToggle?.(s._id, e.target.checked)}
        />
      </TableCell>

      <TableCell sx={{ fontWeight: 600 }}>{s.name}</TableCell>
      <TableCell>{s.ip_address}</TableCell>
      <TableCell sx={{ textTransform: 'lowercase', opacity: 0.9 }}>{s.provider}</TableCell>

      <TableCell>
        <Chip
          size="small"
          label={s.status}
          color={statusColor(s.status)}
          variant="filled"
          sx={{ fontWeight: 600, textTransform: 'lowercase' }}
        />
      </TableCell>

      <TableCell>{s.cpu_cores}</TableCell>
      <TableCell>{s.ram_mb}</TableCell>
      <TableCell>{s.storage_gb}</TableCell>

      <TableCell align="right">
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => onEdit(s)}>
              <EditRounded fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => onDelete(s._id)}>
              <DeleteRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

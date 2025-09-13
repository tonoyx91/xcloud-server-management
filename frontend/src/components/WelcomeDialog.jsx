import { Dialog, Box, DialogTitle, DialogContent, Typography, Button } from '@mui/material';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';

export default function WelcomeDialog({ open, onClose, title = 'Welcome back!', subtitle }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{
        px: 3, pt: 2, pb: 2,
        background: 'linear-gradient(135deg,#0EA5E9 0%,#6366F1 60%,#8B5CF6 100%)',
        color: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20
      }}>
        <DialogTitle sx={{ p: 0, display:'flex', gap:1.5, alignItems:'center' }}>
          <CheckCircleRounded />
          <Typography variant="h6" fontWeight={800}>{title}</Typography>
        </DialogTitle>
        {subtitle && <Typography variant="body2" sx={{ opacity: .9 }}>{subtitle}</Typography>}
      </Box>
      <DialogContent sx={{ py: 3 }}>
        <Typography sx={{ opacity:.85 }}>
          You’ve successfully signed in. Manage your servers, create new ones, or edit existing configs.
        </Typography>
        <Box sx={{ textAlign:'right', mt: 2 }}>
          <Button variant="contained" onClick={onClose}>Let’s go</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

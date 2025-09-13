import { SnackbarProvider } from 'notistack';
import { Slide } from '@mui/material';

// nice slide-up animation
const Transition = (props) => <Slide {...props} direction="up" />;

export default function NotifyProvider({ children }) {
  return (
    <SnackbarProvider
      maxSnack={4}
      autoHideDuration={2500}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={Transition}
    >
      {children}
    </SnackbarProvider>
  );
}

// re-export to use in components: const { enqueueSnackbar } = useSnackbar()
export { useSnackbar } from 'notistack';

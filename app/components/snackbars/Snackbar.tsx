import type { ComponentType, PropsWithChildren } from 'react';
import MuiSnackbar from '@mui/material/Snackbar';
import Alert, { type AlertColor } from '@mui/material/Alert';

import type { IModalProps } from '~/providers/modals/types';

interface IProps {
  severity?: AlertColor;
}

const Snackbar: ComponentType<IModalProps & PropsWithChildren & IProps> = ({ children, closing, severity, close }) => {
  return (
    <MuiSnackbar
      open={!closing}
      autoHideDuration={3000}
      onClose={close}
    >
      <Alert variant="filled" severity={severity}>
        {children}
      </Alert>
    </MuiSnackbar>
  )
}

export default Snackbar;

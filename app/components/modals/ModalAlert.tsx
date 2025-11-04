import type { ComponentType, PropsWithChildren, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

import type { IModalProps } from '~/providers/modals/types';

interface IProps {
  title?: ReactNode;
}

const ModalAlert: ComponentType<PropsWithChildren & IModalProps & IProps> = ({ closing, title, children, close }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={!closing}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      onClose={close}
    >
      {title && <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>}
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>
          {t('common_modals.close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalAlert;

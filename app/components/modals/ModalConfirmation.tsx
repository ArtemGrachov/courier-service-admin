import type { ComponentType, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import type { IModalProps } from '~/providers/modals/types';

interface IProps {
  title?: ReactNode;
  question?: ReactNode;
  confirmLabel?: ReactNode;
  rejectLabel?: ReactNode;
  onAnswer?: (confirm: boolean) => any;
}

const ModalConfirmation: ComponentType<IModalProps & IProps> = ({
  closing,
  title,
  question,
  confirmLabel,
  rejectLabel,
  close,
  onAnswer,
}) => {
  const { t } = useTranslation();

  const confirmHandler = () => {
    close();
    onAnswer && onAnswer(true);
  }

  const rejectHandler = () => {
    close();
    onAnswer && onAnswer(false);
  }

  return (
    <Dialog
      open={!closing}
      disableEscapeKeyDown={true}
      aria-labelledby={title ? 'confirmation-dialog-title' : undefined}
      aria-describedby={question ? 'confirmation-dialog-description' : undefined}
    >
      {title && <DialogTitle id="confirmation-dialog-title">
        {title}
      </DialogTitle>}
      {question && <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {question}
        </DialogContentText>
      </DialogContent>}
      <DialogActions>
        <Button onClick={rejectHandler}>
          {rejectLabel ?? t('common_modals.reject')}
        </Button>
        <Button onClick={confirmHandler} autoFocus>
          {confirmLabel ?? t('common_modals.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalConfirmation;

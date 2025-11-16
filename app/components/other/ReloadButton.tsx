import type { ComponentType } from 'react';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';

interface IProps {
  onReload?: () => any;
  isProcessing?: boolean;
}

const ReloadButton: ComponentType<IProps> = ({ isProcessing, onReload }) => {
  return (
    <IconButton
      color="info"
      loading={isProcessing ?? false}
      sx={{ justifyContent: 'flex-start' }}
      onClick={onReload}
    >
      <RefreshIcon />
    </IconButton>
  )
}

export default ReloadButton;


import type { ComponentType } from 'react';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useReloadPageCtx } from '~/providers/reload-page';

interface IProps {
  onReload?: () => any;
  isProcessing?: boolean;
}

const ReloadButton: ComponentType<IProps> = ({ isProcessing, onReload }) => {
  const reloadPage = useReloadPageCtx();

  const reloadHandler = () => {
    if (reloadPage) {
      reloadPage();
    }

    if (onReload) {
      onReload();
    }
  }

  return (
    <IconButton
      color="info"
      loading={isProcessing ?? false}
      sx={{ flex: '0 0 auto', alignSelf: 'flex-start' }}
      onClick={reloadHandler}
    >
      <RefreshIcon />
    </IconButton>
  )
}

export default ReloadButton;


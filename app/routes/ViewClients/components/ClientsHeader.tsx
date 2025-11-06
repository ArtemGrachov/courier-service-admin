import type { ComponentType } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useClientsCtx } from '~/providers/clients';
import { useReloadPageCtx } from '~/providers/reload-page';

const ClientsHeader: ComponentType = () => {
  const { store: clientsStore } = useClientsCtx();
  const reloadPage = useReloadPageCtx();

  const refreshHandler = async () => {
    reloadPage!();
  }

  return (
    <Stack direction="row" justifyContent="space-between" gap={4}>
      <Stack direction="row" gap={2}>
        <IconButton
          color="info"
          loading={clientsStore.isProcessing}
          onClick={refreshHandler}
        >
          <RefreshIcon />
        </IconButton>
      </Stack>
    </Stack>
  )
}

export default ClientsHeader;

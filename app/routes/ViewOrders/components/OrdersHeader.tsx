import type { ComponentType } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useOrdersCtx } from '~/providers/orders';
import { useReloadPageCtx } from '~/providers/reload-page';

const OrdersHeader: ComponentType = () => {
  const { store: ordersStore } = useOrdersCtx();
  const reloadPage = useReloadPageCtx();

  const refreshHandler = async () => {
    reloadPage!();
  }

  return (
    <Stack direction="row" justifyContent="space-between" gap={4}>
      <Stack direction="row" gap={2}>
        <IconButton
          color="info"
          loading={ordersStore.isProcessing}
          onClick={refreshHandler}
        >
          <RefreshIcon />
        </IconButton>
      </Stack>
    </Stack>
  )
}

export default OrdersHeader;

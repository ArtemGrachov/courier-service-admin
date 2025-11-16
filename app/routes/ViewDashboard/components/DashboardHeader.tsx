import type { ComponentType } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useReloadPageCtx } from '~/providers/reload-page';
import { useCouriersCtx } from '~/providers/couriers';
import { useOrdersCtx } from '~/providers/orders';
import { useStatsCtx } from '~/providers/stats';

const DashboardHeader: ComponentType = () => {
  const { store: ordersStore } = useOrdersCtx();
  const { store: couriersStore } = useCouriersCtx();
  const { store: statsStore } = useStatsCtx();
  const reloadPage = useReloadPageCtx();

  const refreshHandler = async () => {
    reloadPage!();
  }

  return (
    <Stack direction="row" justifyContent="space-between" gap={4}>
      <Stack direction="row" gap={2}>
        <IconButton
          color="info"
          loading={(ordersStore.isProcessing || couriersStore.isProcessing || statsStore.isProcessing)}
          onClick={refreshHandler}
        >
          <RefreshIcon />
        </IconButton>
      </Stack>
    </Stack>
  )
}

export default DashboardHeader;

import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

import { ROUTES } from '~/router/routes';

import { useReloadPageCtx } from '~/providers/reload-page';

import { useRoutePath } from '~/hooks/routing/use-route-path';
import { useCouriersCtx } from '~/providers/couriers';

const CouriersHeader: ComponentType = () => {
  const { store: couriersStore } = useCouriersCtx();

  const { t } = useTranslation();
  const routePath = useRoutePath();
  const reloadPage = useReloadPageCtx();

  const refreshHandler = async () => {
    console.log('check')
    reloadPage!();
  }

  return (
    <Stack direction="row" justifyContent="space-between" gap={4}>
      <Stack direction="row" gap={2}>
        <IconButton
          color="info"
          loading={couriersStore.isProcessing}
          onClick={refreshHandler}
        >
          <RefreshIcon />
        </IconButton>
        <Button
          component={RouterLink}
          to={routePath(ROUTES.COURIER_ADD)}
          variant="contained"
          color="success"
          startIcon={<AddCircleOutlineIcon />}
        >
          {t('view_couriers.couriers_header.add_courier')}
        </Button>
      </Stack>
    </Stack>
  )
}

export default CouriersHeader;

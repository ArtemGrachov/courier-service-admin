import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

import { ROUTES } from '~/router/routes';

import { useRoutePath } from '~/hooks/routing/use-route-path';

const CouriersHeader: ComponentType = () => {
  const { t } = useTranslation();
  const routePath = useRoutePath();

  return (
    <Stack direction="row" justifyContent="space-between" gap={4}>
      <Stack direction="row" gap={2}>
        <IconButton color="info">
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

import { memo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';

import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import { ROUTE_PATHS } from '~/router/routes';

import { useRoutePath } from '~/hooks/routing/use-route-path';

import type { IClient } from '~/types/models/client';

interface IProps {
  params: any;
}

const ClientsActionCell: ComponentType<IProps> = memo(({ params }) => {
  const { t } = useTranslation();
  const client = params.row as IClient;
  const routePath = useRoutePath();

  return (
    <IconButton
      component={RouterLink}
      to={routePath(ROUTE_PATHS.CLIENT, { clientId: client.id })}
      aria-label={t('clients_table.details')}
    >
      <RemoveRedEyeIcon />
    </IconButton>
  )
})

export default ClientsActionCell;


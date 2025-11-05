import type { ComponentType } from 'react';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router';

import { ROUTES } from '~/router/routes';

import { useRoutePath } from '~/hooks/routing/use-route-path';

import type { IClient } from '~/types/models/client';

interface IProps {
  client: IClient;
}

const OrderClient: ComponentType<IProps> = ({ client }) => {
  const routePath = useRoutePath();

  return (
    <Link
      to={routePath(ROUTES.CLIENT, { clientId: client.id })}
      component={RouterLink}
    >
      {client.name}
    </Link>
  )
}

export default OrderClient;

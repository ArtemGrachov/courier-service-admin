import { memo, type ComponentType } from 'react';
import { Link as RouterLink } from 'react-router';
import Link from '@mui/material/Link';

import { ROUTES } from '~/router/routes';

import { useRoutePath } from '~/hooks/routing/use-route-path';

import type { IOrder } from '~/types/models/order';

interface IProps {
  params: any;
}

const OrdersCourierLink: ComponentType<IProps> = memo(({ params }) => {
  const courier = (params.row as IOrder).courier;
  const routePath = useRoutePath();

  if (!courier) {
    return '-';
  }

  return (
    <Link
      to={routePath(ROUTES.COURIER, { courierId: courier.id })}
      component={RouterLink}
    >
      {courier.name}
    </Link>
  )
})

export default OrdersCourierLink;


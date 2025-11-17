import { memo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';

import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import { ROUTE_PATHS } from '~/router/routes';

import { useRoutePath } from '~/hooks/routing/use-route-path';

import type { IOrder } from '~/types/models/order';

interface IProps {
  params: any;
}

const OrdersActionCell: ComponentType<IProps> = memo(({ params }) => {
  const { t } = useTranslation();
  const order = params.row as IOrder;
  const routePath = useRoutePath();

  return (
    <IconButton
      component={RouterLink}
      to={routePath(ROUTE_PATHS.ORDER, { orderId: order.id })}
      aria-label={t('orders_table.details')}
    >
      <RemoveRedEyeIcon />
    </IconButton>
  )
})

export default OrdersActionCell;


import { memo, type ComponentType } from 'react';

import OrderClient from '~/components/orders/OrderClient';

import type { IOrder } from '~/types/models/order';

interface IProps {
  params: any;
}

const OrderSenderCell: ComponentType<IProps> = memo(({ params }) => {
  const client = (params.row as IOrder).sender;

  if (!client) {
    return '-';
  }

  return <OrderClient client={client} />
});

export default OrderSenderCell;


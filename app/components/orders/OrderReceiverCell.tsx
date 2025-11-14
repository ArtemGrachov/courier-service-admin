import { memo, type ComponentType } from 'react';

import OrderClient from '~/components/orders/OrderClient';

import type { IOrder } from '~/types/models/order';

interface IProps {
  params: any;
}

const OrderReceiverCell: ComponentType<IProps> = memo(({ params }) => {
  const client = (params.row as IOrder).receiver;

  if (!client) {
    return '-';
  }

  return <OrderClient client={client} />
});

export default OrderReceiverCell;


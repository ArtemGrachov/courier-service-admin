import type { IGetOrderResponse } from '~/types/api/orders';
import type { IClient } from '~/types/models/client';
import type { ICourier } from '~/types/models/courier';
import type { IOrder } from '~/types/models/order';

import { mockRequest } from '~/utils/mock-request';

export const fetchOrder = async (orderId: number) => {
  const [
    orders,
    couriers,
    clients,
  ] = await Promise.all([
    import('~/mock-data/orders.json').then(m => m.default as IOrder[]),
    import('~/mock-data/couriers.json').then(m => m.default as ICourier[]),
    import('~/mock-data/clients.json').then(m => m.default as IClient[]),
  ]);

  const order = orders.find(o => o.id === orderId);
  const data = (await mockRequest<IGetOrderResponse>(order));

  if (!data) {
    throw new Error('404');
  }

  const couriersMap = couriers.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {} as Record<number, ICourier>);

  const clientsMap = clients.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {} as Record<number, IClient>);

  data.courier = couriersMap[data.courierId];
  data.sender = clientsMap[data.senderId];
  data.receiver = clientsMap[data.receiverId];

  return data!;
}

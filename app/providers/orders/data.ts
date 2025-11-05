import type { IGetOrdersQuery, IGetOrdersResponse } from '~/types/api/orders';
import type { IClient } from '~/types/models/client';
import type { ICourier } from '~/types/models/courier';
import type { IOrder } from '~/types/models/order';

import { mockPaginationRequest } from '~/utils/mock-request';

export const fetchOrders = async (query?: IGetOrdersQuery) => {
  const [
    orders,
    couriers,
    clients,
  ] = await Promise.all([
    import('~/mock-data/orders.json').then(m => m.default as IOrder[]),
    import('~/mock-data/couriers.json').then(m => m.default as ICourier[]),
    import('~/mock-data/clients.json').then(m => m.default as IClient[]),
  ]);

  const data = await mockPaginationRequest<IGetOrdersResponse, IOrder>(
    query?.page ?? 1,
    query?.itemsPerPage ?? 30,
    orders,
  );

  const couriersMap = couriers.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {} as Record<number, ICourier>);

  const clientsMap = clients.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {} as Record<number, IClient>);

  data?.data.forEach(order => {
    order.courier = couriersMap[order.courierId];
    order.client = clientsMap[order.clientId];
  });

  return data!;
}

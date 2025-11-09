import type { IGetOrdersQuery, IGetOrdersResponse } from '~/types/api/orders';
import type { IClient } from '~/types/models/client';
import type { ICourier } from '~/types/models/courier';
import type { IOrder } from '~/types/models/order';

import { mockPaginationRequest } from '~/utils/mock-request';

export const fetchOrders = async (query?: IGetOrdersQuery) => {
  let [
    orders,
    couriers,
    clients,
  ] = await Promise.all([
    import('~/mock-data/orders.json').then(m => m.default as IOrder[]),
    import('~/mock-data/couriers.json').then(m => m.default as ICourier[]),
    import('~/mock-data/clients.json').then(m => m.default as IClient[]),
  ]);

  if (query?.clientIds) {
    const set = new Set(query.clientIds);
    orders = orders.filter(o => set.has(o.senderId) || set.has(o.receiverId));
  }

  if (query?.senderIds) {
    const set = new Set(query.senderIds);
    orders = orders.filter(o => set.has(o.senderId));
  }

  if (query?.receiverIds) {
    const set = new Set(query.receiverIds);
    orders = orders.filter(o => set.has(o.receiverId));
  }

  if (query?.courierIds) {
    const set = new Set(query.courierIds);
    orders = orders.filter(o => set.has(o.courierId));
  }

  if (query?.statuses) {
    const set = new Set(query.statuses);
    orders = orders.filter(o => set.has(o.status));
  }

  const data = await mockPaginationRequest<IGetOrdersResponse, IOrder>(
    query?.page ?? 1,
    query?.itemsPerPage ?? 100,
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
    order.sender = clientsMap[order.senderId];
    order.receiver = clientsMap[order.receiverId];
  });

  return data!;
}

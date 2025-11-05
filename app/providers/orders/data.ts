import type { IGetOrdersQuery, IGetOrdersResponse } from '~/types/api/orders';
import type { IOrder } from '~/types/models/order';

import { mockPaginationRequest } from '~/utils/mock-request';

export const fetchOrders = async (query?: IGetOrdersQuery) => {
  const orders = await import('~/mock-data/orders.json').then(m => m.default as IOrder[]);
  const data = await mockPaginationRequest<IGetOrdersResponse, IOrder>(
    query?.page ?? 1,
    query?.itemsPerPage ?? 30,
    orders,
  );

  return data!;
}

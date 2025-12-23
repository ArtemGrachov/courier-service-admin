import { HttpClient } from '~/providers/http-client/http-client';

import type { IGetOrdersQuery, IGetOrdersResponse } from '~/types/api/orders';

export const fetchOrders = async (query?: IGetOrdersQuery) => {
  const httpClient = HttpClient.instance.httpClient;

  let sortBy, sortOrder;

  if (query?.search) {
    sortBy = 'search';
    sortOrder = query.search;
  }

  if (query?.dateTimeOrderedSort) {
    sortBy = 'orderedAt';
    sortOrder = query.dateTimeOrderedSort;
  }

  if (query?.dateTimeClosedSort) {
    sortBy = 'completedAt';
    sortOrder = query.dateTimeClosedSort;
  }

  const { search } = query ?? {};

  const params = {
    page: query?.page,
    itemsPerPage: query?.itemsPerPage,
    search: (search?.length ?? 0) >= 3 ? search : undefined,
    status: query?.statuses,
    couriers: query?.courierIds,
    senders: query?.senderIds,
    receivers: query?.receiverIds,
    sortBy,
    sortOrder,
  };

  console.log(params);

  const { data } = await httpClient.get<IGetOrdersResponse>('/orders', { params });

  return data;
}

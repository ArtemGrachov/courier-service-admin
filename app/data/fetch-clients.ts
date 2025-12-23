import { HttpClient } from '~/providers/http-client/http-client';

import type { IGetClientsQuery, IGetClientsResponse } from '~/types/api/clients';

export const fetchClients = async (query?: IGetClientsQuery) => {
  const httpClient = HttpClient.instance.httpClient;

  let sortBy, sortOrder;

  if (query?.nameSort) {
    sortBy = 'name';
    sortOrder = query.nameSort;
  } else if (query?.ratingSort) {
    sortBy = 'rating';
    sortOrder = query.ratingSort;
  } else if (query?.activeOrdersCountSort) {
    sortBy = 'activeOrders';
    sortOrder = query.activeOrdersCountSort;
  } else if (query?.completedOrdersCountSort) {
    sortBy = 'completedOrders';
    sortOrder = query.completedOrdersCountSort;
  } else if (query?.totalOrdersCountSort) {
    sortBy = 'totalOrders';
    sortOrder = query.totalOrdersCountSort;
  }

  const { nameSearch, emailSearch, phoneSearch } = query ?? {};

  const params = {
    page: query?.page,
    itemsPerPage: query?.itemsPerPage,
    name: (nameSearch?.length ?? 0) >= 3 ? nameSearch : undefined,
    email: (emailSearch?.length ?? 0) >= 3 ? emailSearch : undefined,
    phone: (phoneSearch?.length ?? 0) >= 3 ? phoneSearch : undefined,
    search: query?.search,
    sortBy,
    sortOrder,
  };

  const { data } = await httpClient.get<IGetClientsResponse>('/client', { params });

  return data;
}

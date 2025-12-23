import { HttpClient } from '~/providers/http-client/http-client';

import type { IGetCouriersQuery, IGetCouriersResponse } from '~/types/api/couriers';

export const fetchCouriers = async (query?: IGetCouriersQuery) => {
  const httpClient = HttpClient.instance.httpClient;

  let sortBy, sortOrder;

  if (query?.ratingSort) {
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

  const { data } = await httpClient.get<IGetCouriersResponse>('/courier', {
    params: {
      page: query?.page,
      itemsPerPage: query?.itemsPerPage,
      status: query?.statuses,
      sortBy,
      sortOrder,
    },
  });

  return data;
}

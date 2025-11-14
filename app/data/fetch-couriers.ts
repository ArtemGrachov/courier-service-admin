import { ESortDirection } from '~/constants/sort';

import type { IGetCouriersQuery, IGetCouriersResponse } from '~/types/api/couriers';
import type { ICourier } from '~/types/models/courier';

import { mockPaginationRequest } from '~/utils/mock-request';

export const fetchCouriers = async (query?: IGetCouriersQuery) => {
  let couriers = await import('~/mock-data/couriers.json').then(m => m.default as ICourier[]);

  if (query?.nameSearch) {
    const searchBy = query.nameSearch.toLowerCase();
    couriers = couriers.filter(c => c.name.toLowerCase().includes(searchBy));
  }

  if (query?.phoneSearch) {
    const searchBy = query.phoneSearch.toLowerCase();
    couriers = couriers.filter(c => c.phoneNumber.toLowerCase().replaceAll(' ', '').includes(searchBy));
  }

  if (query?.emailSearch) {
    const searchBy = query.emailSearch.toLowerCase();
    couriers = couriers.filter(c => c.email.toLowerCase().includes(searchBy));
  }

  if (query?.courierIds) {
    const set = new Set(query.courierIds);
    couriers = couriers.filter(c => set.has(c.id));
  }

  if (query?.status) {
    couriers = couriers.filter(c => c.status === query.status);
  }

  if (query?.nameSort) {
    const direction = query.nameSort === ESortDirection.ASC ? 1 : -1;

    couriers = [...couriers].sort((a, b) => {
      return a.name > b.name ? direction : a.name < b.name ? -direction : 0;
    });
  }

  if (query?.currentOrdersCountSort) {
    const direction = query.currentOrdersCountSort === ESortDirection.ASC ? 1 : -1;

    couriers = [...couriers].sort((a, b) => {
      return Math.sign(a.currentOrdersCount -b.currentOrdersCount) * direction;
    });
  }

  if (query?.totalOrdersCountSort) {
    const direction = query.totalOrdersCountSort === ESortDirection.ASC ? 1 : -1;

    couriers = [...couriers].sort((a, b) => {
      return Math.sign(a.totalOrdersCount -b.totalOrdersCount) * direction;
    });
  }

  if (query?.ratingSort) {
    const direction = query.ratingSort === ESortDirection.ASC ? 1 : -1;

    couriers = [...couriers].sort((a, b) => {
      return Math.sign(a.rating -b.rating) * direction;
    });
  }

  const data = await mockPaginationRequest<IGetCouriersResponse, ICourier>(
    query?.page ?? 1,
    query?.itemsPerPage ?? 30,
    couriers,
  );

  return data!;
}

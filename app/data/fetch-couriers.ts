import { ESortDirection } from '~/constants/sort';

import type { IGetCouriersQuery, IGetCouriersResponse } from '~/types/api/couriers';
import type { ICourier } from '~/types/models/courier';

import { mockPaginationRequest } from '~/utils/mock-request';

export const fetchCouriers = async (query?: IGetCouriersQuery) => {
  let couriers = await import('~/mock-data/couriers.json').then(m => m.default as ICourier[]);

  const nameSearch = query?.nameSearch ?? query?.search;
  const phoneSearch = query?.phoneSearch ?? query?.search;
  const emailSearch = query?.emailSearch ?? query?.search;

  const hasSearch = nameSearch != null || phoneSearch != null || emailSearch != null;

  if (hasSearch) {
    const searchByName = nameSearch?.toLowerCase();
    const searchByPhone = phoneSearch?.toLowerCase();
    const searchByEmail = emailSearch?.toLowerCase();

    couriers = couriers.filter(courier => {
      if (searchByName != null && courier.name.toLowerCase().includes(searchByName)) {
        return true;
      }

      if (searchByEmail != null && courier.name.toLowerCase().includes(searchByEmail)) {
        return true;
      }

      if (searchByPhone != null && courier.phoneNumber.toLowerCase().replaceAll(' ', '').includes(searchByPhone)) {
        return true;
      }

      return false;
    })
  }

  if (query?.courierIds) {
    const set = new Set(query.courierIds);
    couriers = couriers.filter(c => set.has(c.id));
  }

  if (query?.statuses?.length) {
    couriers = couriers.filter(c => (query.statuses as string[]).includes(c.status));
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

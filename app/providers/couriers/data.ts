import type { IGetCouriersQuery, IGetCouriersResponse } from '~/types/api/couriers';
import { mockPaginationRequest } from '~/utils/mock-request';

import type { ICourier } from '~/types/models/courier';

export const fetchCouriers = async (query?: IGetCouriersQuery) => {
  let couriers = await import('~/mock-data/couriers.json').then(m => m.default as ICourier[]);

  if (query?.courierIds) {
    const set = new Set(query.courierIds);
    couriers = couriers.filter(c => set.has(c.id));
  }

  const data = await mockPaginationRequest<IGetCouriersResponse, ICourier>(
    query?.page ?? 1,
    query?.itemsPerPage ?? 30,
    couriers,
  );

  return data!;
}

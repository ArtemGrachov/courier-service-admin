import { useRef } from 'react';

import { CouriersStore } from './store';

import type { IGetCouriersQuery, IGetCouriersResponse } from '~/types/api/couriers';
import type { ICourier } from '~/types/models/courier';

import { mockPaginationRequest } from '~/utils/mock-request';

export const useCouriersService = () => {
  const couriersStore = useRef<CouriersStore>(null as unknown as CouriersStore);

  if (!couriersStore.current) {
    couriersStore.current = new CouriersStore();
  }

  const fetch = async (query?: IGetCouriersQuery) => {
    try {
      couriersStore.current.doGetInit();

      const couriers = await import('~/mock-data/couriers.json').then(m => m.default as ICourier[]);
      const data = await mockPaginationRequest<IGetCouriersResponse, ICourier>(
        query?.page ?? 1,
        query?.itemsPerPage ?? 30,
        couriers,
      );

      couriersStore.current.doGetSuccess(data as IGetCouriersResponse);
    } catch (err) {
      couriersStore.current.doGetError(err);
      throw err;
    }
  }

  return {
    store: couriersStore.current,
    fetch,
  };
}

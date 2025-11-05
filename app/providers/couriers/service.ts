import { useRef } from 'react';

import { CouriersStore } from './store';

import type { IGetCouriersQuery, IGetCouriersResponse } from '~/types/api/couriers';

import { fetchCouriers } from '~/providers/couriers/data';

export const useCouriersService = (initialData?: IGetCouriersResponse) => {
  const couriersStore = useRef<CouriersStore>(null as unknown as CouriersStore);

  if (!couriersStore.current) {
    couriersStore.current = new CouriersStore(initialData);
  }

  const fetch = async (query?: IGetCouriersQuery) => {
    try {
      couriersStore.current.doGetInit();
      const data = await fetchCouriers(query)
      couriersStore.current.doGetSuccess(data);
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

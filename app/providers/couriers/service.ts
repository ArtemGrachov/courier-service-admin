import { useEffect, useRef } from 'react';

import { CouriersStore, type ICouriersStoreData } from '../../store/couriers.store';

import type { IGetCouriersQuery } from '~/types/api/couriers';

import { fetchCouriers } from '~/data/fetch-couriers';

export const useCouriersService = (initialData?: ICouriersStoreData) => {
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

  useEffect(() => {
    if (!initialData) {
      return;
    }

    couriersStore.current.setData(initialData);
  }, [initialData]);

  return {
    store: couriersStore.current,
    fetch,
  };
}

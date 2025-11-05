import { useRef } from 'react';

import { CourierStore } from './store';

import { fetchCourier } from '~/providers/courier/data';

export const useCourierService = () => {
  const courierStore = useRef<CourierStore>(null as unknown as CourierStore);

  if (!courierStore.current) {
    courierStore.current = new CourierStore();
  }

  const fetch = async (courierId: number) => {
    try {
      courierStore.current.doGetInit();

      const data = await fetchCourier(courierId)

      courierStore.current.doGetSuccess(data);
    } catch (err) {
      courierStore.current.doGetError(err);
      throw err;
    }
  }

  return {
    store: courierStore.current,
    fetch,
  };
}

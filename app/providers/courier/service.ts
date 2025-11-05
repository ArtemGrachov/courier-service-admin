import { useRef } from 'react';

import { CourierStore } from './store';

import type { ICourier } from '~/types/models/courier';

export const useCourierService = () => {
  const courierStore = useRef<CourierStore>(null as unknown as CourierStore);

  if (!courierStore.current) {
    courierStore.current = new CourierStore();
  }

  const fetch = async (courierId: number) => {
    try {
      courierStore.current.doGetInit();

      const couriers = await import('~/mock-data/couriers.json').then(m => m.default as ICourier[]);
      const data = couriers.find(c => c.id === courierId);

      if (!data) {
        throw new Error('404');
      }

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

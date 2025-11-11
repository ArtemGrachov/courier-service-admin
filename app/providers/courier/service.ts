import { useRef } from 'react';

import { CourierStore, type ICourierStoreData } from './store';

import { fetchCourier } from '~/providers/courier/data';

export const useCourierService = (initialData?: ICourierStoreData) => {
  const courierStore = useRef<CourierStore>(null as unknown as CourierStore);

  if (!courierStore.current) {
    courierStore.current = new CourierStore(initialData);
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

  const setProcessing = () => {
    courierStore.current.doGetInit();
  }

  return {
    store: courierStore.current,
    fetch,
    setProcessing,
  };
}

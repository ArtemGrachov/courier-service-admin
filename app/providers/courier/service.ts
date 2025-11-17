import { useRef } from 'react';

import { CourierStore, type ICourierStoreData } from './store';

export const useCourierService = (initialData?: ICourierStoreData) => {
  const courierStore = useRef<CourierStore>(null as unknown as CourierStore);

  if (!courierStore.current) {
    courierStore.current = new CourierStore(initialData);
  }

  const setProcessing = () => {
    courierStore.current.doGetInit();
  }

  return {
    store: courierStore.current,
    setProcessing,
  };
}

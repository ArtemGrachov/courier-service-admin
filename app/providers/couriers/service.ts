import { useEffect, useRef } from 'react';

import { CouriersStore, type ICouriersStoreData } from '~/store/couriers.store';

export const useCouriersService = (initialData?: ICouriersStoreData) => {
  const couriersStore = useRef<CouriersStore>(null as unknown as CouriersStore);

  if (!couriersStore.current) {
    couriersStore.current = new CouriersStore(initialData);
  }

  const setProcessing = () => {
    couriersStore.current.doGetInit();
  }

  useEffect(() => {
    if (!initialData) {
      return;
    }

    couriersStore.current.setData(initialData);
  }, [initialData]);

  return {
    store: couriersStore.current,
    setProcessing,
  };
}

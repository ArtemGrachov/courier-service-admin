import { useEffect, useRef } from 'react';

import { OrdersStore, type IOrdersStoreData } from './store';

import type { IGetOrdersQuery } from '~/types/api/orders';

export const useOrdersService = (initialData?: IOrdersStoreData) => {
  const ordersStore = useRef<OrdersStore>(null as unknown as OrdersStore);

  if (!ordersStore.current) {
    ordersStore.current = new OrdersStore(initialData);
  }

  const setProcessing = () => {
    ordersStore.current.doGetInit();
  }

  useEffect(() => {
    if (!initialData) {
      return;
    }

    ordersStore.current.setData(initialData);
  }, [initialData]);

  return {
    store: ordersStore.current,
    setProcessing,
  };
}


import { useEffect, useRef } from 'react';

import { OrdersStore, type IOrdersStoreData } from './store';

import type { IGetOrdersQuery } from '~/types/api/orders';

import { fetchOrders } from './data';

export const useOrdersService = (initialData?: IOrdersStoreData) => {
  const ordersStore = useRef<OrdersStore>(null as unknown as OrdersStore);

  if (!ordersStore.current) {
    ordersStore.current = new OrdersStore(initialData);
  }

  const fetch = async (query?: IGetOrdersQuery) => {
    try {
      ordersStore.current.doGetInit();
      const data = await fetchOrders(query)
      ordersStore.current.doGetSuccess(data);
    } catch (err) {
      ordersStore.current.doGetError(err);
      throw err;
    }
  }

  useEffect(() => {
    if (!initialData) {
      return;
    }

    ordersStore.current.setData(initialData);
  }, [initialData]);

  return {
    store: ordersStore.current,
    fetch,
  };
}

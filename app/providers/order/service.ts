import { useRef } from 'react';

import { OrderStore, type IOrderStoreData } from './store';

import { fetchOrder } from './data';

export const useOrderService = (initialData?: IOrderStoreData) => {
  const orderStore = useRef<OrderStore>(null as unknown as OrderStore);

  if (!orderStore.current) {
    orderStore.current = new OrderStore(initialData);
  }

  const fetch = async (orderId: number) => {
    try {
      orderStore.current.doGetInit();
      const data = await fetchOrder(orderId);
      orderStore.current.doGetSuccess(data);
    } catch (err) {
      orderStore.current.doGetError(err);
      throw err;
    }
  }

  const setProcessing = () => {
    orderStore.current.doGetInit();
  }

  return {
    store: orderStore.current,
    fetch,
    setProcessing,
  };
}

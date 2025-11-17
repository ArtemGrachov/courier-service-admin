import { useRef } from 'react';

import { OrderStore, type IOrderStoreData } from './store';

export const useOrderService = (initialData?: IOrderStoreData) => {
  const orderStore = useRef<OrderStore>(null as unknown as OrderStore);

  if (!orderStore.current) {
    orderStore.current = new OrderStore(initialData);
  }

  const setProcessing = () => {
    orderStore.current.doGetInit();
  }

  return {
    store: orderStore.current,
    setProcessing,
  };
}

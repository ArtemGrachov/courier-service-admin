import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useOrderService } from './service';

import type { IOrderStoreData } from './store';

export const OrderContext = createContext<ReturnType<typeof useOrderService>>(null as any);

interface IProps {
  initialData?: IOrderStoreData;
}

export const OrderProvider: ComponentType<PropsWithChildren & IProps> = ({ children, initialData }) => {
  const orderService = useOrderService(initialData);

  return (
    <OrderContext.Provider value={orderService}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrderCtx = () => useContext(OrderContext);

import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useOrdersService } from './service';

import type { IOrdersStoreData } from './store';

export const OrdersContext = createContext<ReturnType<typeof useOrdersService>>(null as any);

interface IProps {
  initialData?: IOrdersStoreData;
}

export const OrdersProvider: ComponentType<PropsWithChildren & IProps> = ({ children, initialData }) => {
  const ordersService = useOrdersService(initialData);

  return (
    <OrdersContext.Provider value={ordersService}>
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrdersCtx = () => useContext(OrdersContext);

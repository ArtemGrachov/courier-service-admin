import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';
import { useOrdersFilterService } from './service';

export const OrdersFilterContext = createContext<ReturnType<typeof useOrdersFilterService>>(null as any);

export const OrdersFilterProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const service = useOrdersFilterService();

  return (
    <OrdersFilterContext.Provider value={service}>
      {children}
    </OrdersFilterContext.Provider>
  )
}

export const useOrdersFilterCtx = () => useContext(OrdersFilterContext);


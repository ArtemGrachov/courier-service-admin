import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useOrderFiltersService } from '~/providers/order-filters/service';

export const OrderFilterContext = createContext<ReturnType<typeof useOrderFiltersService>>(null as unknown as any);

export const OrderFilterProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const service = useOrderFiltersService();

  return (
    <OrderFilterContext.Provider value={service}>
      {children}
    </OrderFilterContext.Provider>
  )
}

export default OrderFilterProvider;

export const useOrderFilterCtx = () => useContext(OrderFilterContext);

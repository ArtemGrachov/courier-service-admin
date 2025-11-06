import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useOrdersService } from '~/providers/orders/service';
import type { IOrdersStoreData } from '~/providers/orders/store';

export const ActiveOrdersContext = createContext<ReturnType<typeof useOrdersService>>(null as any);

interface IProps {
  initialData?: IOrdersStoreData;
}

export const ActiveOrdersProvider: ComponentType<PropsWithChildren & IProps> = ({ children, initialData }) => {
  const ordersService = useOrdersService(initialData);

  return (
    <ActiveOrdersContext.Provider value={ordersService}>
      {children}
    </ActiveOrdersContext.Provider>
  )
}

export const useActiveOrdersCtx = () => useContext(ActiveOrdersContext);

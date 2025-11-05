import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useCourierService } from './service';

export const CourierContext = createContext<ReturnType<typeof useCourierService>>(null as any);

export const CourierProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const courierService = useCourierService();

  return (
    <CourierContext.Provider value={courierService}>
      {children}
    </CourierContext.Provider>
  )
}

export const useCourierCtx = () => useContext(CourierContext);

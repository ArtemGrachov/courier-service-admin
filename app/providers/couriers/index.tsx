import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useCouriersService } from './service';

export const CouriersContext = createContext<ReturnType<typeof useCouriersService>>(null as any);

export const CouriersProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const couriersService = useCouriersService();

  return (
    <CouriersContext.Provider value={couriersService}>
      {children}
    </CouriersContext.Provider>
  )
}

export const useCouriersCtx = () => useContext(CouriersContext);

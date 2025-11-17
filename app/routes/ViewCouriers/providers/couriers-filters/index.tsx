import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';
import { useCouriersFiltersService } from './service';

export const CouriersFiltersContext = createContext<ReturnType<typeof useCouriersFiltersService>>(null as any);

export const CouriersFiltersProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const service = useCouriersFiltersService();

  return (
    <CouriersFiltersContext.Provider value={service}>
      {children}
    </CouriersFiltersContext.Provider>
  )
}

export const useCouriersFiltersCtx = () => useContext(CouriersFiltersContext);


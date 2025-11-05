import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useUpsertCourierService } from './service';

export const UpsertCourierContext = createContext<ReturnType<typeof useUpsertCourierService>>(null as any);

export const UpsertCourierProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const upsertCourierService = useUpsertCourierService();

  return (
    <UpsertCourierContext.Provider value={upsertCourierService}>
      {children}
    </UpsertCourierContext.Provider>
  )
}

export const useUpsertCourierCtx = () => useContext(UpsertCourierContext);

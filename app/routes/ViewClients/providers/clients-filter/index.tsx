import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';
import { useClientsFilterService } from './service';

export const ClientsFilterContext = createContext<ReturnType<typeof useClientsFilterService>>(null as any);

export const ClientsFilterProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const service = useClientsFilterService();

  return (
    <ClientsFilterContext.Provider value={service}>
      {children}
    </ClientsFilterContext.Provider>
  )
}

export const useClientsFilterCtx = () => useContext(ClientsFilterContext);


import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useClientsService } from './service';

import type { IClientsStoreData } from './store';

export const ClientsContext = createContext<ReturnType<typeof useClientsService>>(null as any);

interface IProps {
  initialData?: IClientsStoreData;
}

export const ClientsProvider: ComponentType<PropsWithChildren & IProps> = ({ children, initialData }) => {
  const clientsService = useClientsService(initialData);

  return (
    <ClientsContext.Provider value={clientsService}>
      {children}
    </ClientsContext.Provider>
  )
}

export const useClientsCtx = () => useContext(ClientsContext);

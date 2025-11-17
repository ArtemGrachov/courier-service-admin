import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useClientService } from './service';

import type { IClientStoreData } from './store';

export const ClientContext = createContext<ReturnType<typeof useClientService>>(null as any);

interface IProps {
  initialData?: IClientStoreData;
}

export const ClientProvider: ComponentType<PropsWithChildren & IProps> = ({ children, initialData }) => {
  const clientService = useClientService(initialData);

  return (
    <ClientContext.Provider value={clientService}>
      {children}
    </ClientContext.Provider>
  )
}

export const useClientCtx = () => useContext(ClientContext);

import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useHttpClientService } from './service';

export const HttpClientContext = createContext<ReturnType<typeof useHttpClientService>>(null as unknown as ReturnType<typeof useHttpClientService>);

export const HttpClientProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const service = useHttpClientService();

  return (
    <HttpClientContext.Provider value={service}>
      {children}
    </HttpClientContext.Provider>
  )
}

export const useHttpClientCtx = () => useContext(HttpClientContext);


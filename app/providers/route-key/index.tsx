import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';
import { useRouteKeyService } from './service';

export const RouteKeyContext = createContext<ReturnType<typeof useRouteKeyService> | null>(null);

export const RouteKeyProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const service = useRouteKeyService();

  return (
    <RouteKeyContext.Provider value={service}>
      {children}
    </RouteKeyContext.Provider>
  )
}

export const useRouteKeyCtx = () => useContext(RouteKeyContext);


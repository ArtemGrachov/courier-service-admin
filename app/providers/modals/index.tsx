import { useModalService } from './service';
import { type ComponentType, createContext, type PropsWithChildren } from 'react';

export const ModalsContext = createContext<ReturnType<typeof useModalService>>(null as any);

export const ModalsProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const service = useModalService();

  return (
    <ModalsContext.Provider value={service}>
      {children}
    </ModalsContext.Provider>
  )
}

import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

export const ReloadPageContext = createContext<Function | null | undefined>(null);

interface IProps {
  reloadFunction?: Function | null;
}

export const ReloadPageProvider: ComponentType<PropsWithChildren & IProps> = ({ children, reloadFunction }) => {
  return (
    <ReloadPageContext.Provider value={reloadFunction}>
      {children}
    </ReloadPageContext.Provider>
  )
}

export const useReloadPageCtx = () => useContext(ReloadPageContext);

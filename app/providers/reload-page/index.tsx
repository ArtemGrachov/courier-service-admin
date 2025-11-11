import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useDefaultReload } from './hooks/use-default-reload';

export const ReloadPageContext = createContext<Function | null | undefined>(null);

interface IProps {
  isDefaultReload?: boolean;
  reloadFunction?: Function | null;
}

export const ReloadPageProvider: ComponentType<PropsWithChildren & IProps> = ({ children, isDefaultReload, reloadFunction }) => {
  isDefaultReload = isDefaultReload ?? true;

  const defaultReload = useDefaultReload();

  const reloadHandler = () => {
    if (reloadFunction) {
      reloadFunction();
    }

    if (isDefaultReload) {
      defaultReload();
    }
  }

  return (
    <ReloadPageContext.Provider value={reloadHandler}>
      {children}
    </ReloadPageContext.Provider>
  )
}

export const useReloadPageCtx = () => {
  const reloadFunction = useContext(ReloadPageContext);
  const defaultReload = useDefaultReload();

  if (reloadFunction) {
    return reloadFunction;
  }

  return defaultReload;
}


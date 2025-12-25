import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useChangePasswordService } from './service';

export const ChangePasswordContext = createContext<ReturnType<typeof useChangePasswordService>>(null as any);

export const ChangePasswordProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const changePasswordService = useChangePasswordService();

  return (
    <ChangePasswordContext.Provider value={changePasswordService}>
      {children}
    </ChangePasswordContext.Provider>
  )
}

export const useChangePasswordCtx = () => useContext(ChangePasswordContext);

import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useLoginService } from './service';

export const LoginContext = createContext<ReturnType<typeof useLoginService>>(null as any);

export const LoginProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const loginService = useLoginService();

  return (
    <LoginContext.Provider value={loginService}>
      {children}
    </LoginContext.Provider>
  )
}

export const useLoginCtx = () => useContext(LoginContext);

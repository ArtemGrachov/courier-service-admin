import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useForgotPasswordService } from './service';

export const ForgotPasswordContext = createContext<ReturnType<typeof useForgotPasswordService>>(null as any);

export const ForgotPasswordProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const forgotPasswordService = useForgotPasswordService();

  return (
    <ForgotPasswordContext.Provider value={forgotPasswordService}>
      {children}
    </ForgotPasswordContext.Provider>
  )
}

export const useForgotPasswordCtx = () => useContext(ForgotPasswordContext);

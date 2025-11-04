import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useResetPasswordService } from './service';

export const ResetPasswordContext = createContext<ReturnType<typeof useResetPasswordService>>(null as any);

export const ResetPasswordProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const resetPasswordService = useResetPasswordService();

  return (
    <ResetPasswordContext.Provider value={resetPasswordService}>
      {children}
    </ResetPasswordContext.Provider>
  )
}

export const useResetPasswordCtx = () => useContext(ResetPasswordContext);

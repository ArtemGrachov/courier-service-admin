import { createContext, type ComponentType, type PropsWithChildren } from 'react';

import { useAuthService } from '~/providers/auth/service';

export const AuthContext = createContext<ReturnType<typeof useAuthService>>(null as any);

export const AuthProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const authService = useAuthService();

  return ((
    <AuthContext.Provider value={authService}>
      {children}
    </AuthContext.Provider>
  ))
}

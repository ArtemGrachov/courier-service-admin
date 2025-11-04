import { useRef } from 'react';

import { STORAGE_AUTH_TOKEN_KEY } from '~/constants/auth';

import { AuthStore } from '~/providers/auth/store';
import { useStorageCtx } from '~/providers/storage/hooks/use-storage-ctx'

export const useAuthService = () => {
  const authStore = useRef<AuthStore>(null as unknown as AuthStore);
  const storage = useStorageCtx();

  if (!authStore.current) {
    authStore.current = new AuthStore();
  }

  const init = () => {
    const authToken = storage.getItem(STORAGE_AUTH_TOKEN_KEY);

    if (!authToken) {
      return;
    }

    authorize(authToken);
  }

  const authorize = (authToken: string) => {
    authStore.current.isAuthorized = true;
    storage.setItem(STORAGE_AUTH_TOKEN_KEY, authToken);
  }

  const unauthorize = () => {
    authStore.current.isAuthorized = false;
    storage.removeItem(STORAGE_AUTH_TOKEN_KEY);
  }

  return {
    store: authStore.current,
    init,
    authorize,
    unauthorize,
  }
}

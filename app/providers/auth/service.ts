import { useEffect, useRef } from 'react';
import type { AxiosInstance } from 'axios';
import { useNavigate } from 'react-router';

import { STORAGE_AUTH_TOKEN_KEY } from '~/constants/auth';

import { AuthStore } from '~/providers/auth/store';
import { useStorageCtx } from '~/providers/storage/hooks/use-storage-ctx'
import { useHttpClientCtx } from '~/providers/http-client';
import { Cache } from '~/cache/Cache';

export const useAuthService = () => {
  const authStore = useRef<AuthStore>(null as unknown as AuthStore);
  const storage = useStorageCtx();
  const httpClientCtx = useHttpClientCtx();
  const navigate = useNavigate();

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
    Cache.instance.clear();
    authStore.current.authorize(true);
    storage.setItem(STORAGE_AUTH_TOKEN_KEY, authToken);
    httpClientCtx.defaults.headers.Authorization = `Bearer ${authToken}`;
  }

  const unauthorize = () => {
    authStore.current.authorize(false);
    storage.removeItem(STORAGE_AUTH_TOKEN_KEY);
    delete httpClientCtx.defaults.headers.Authorization;
  }

  const setupInterceptor = (httpClient: AxiosInstance) => {
    httpClient.interceptors.response.use(
      res => res,
      error => {
        if (error?.status === 401) {
          Cache.instance.clear();
          unauthorize();
          navigate('/login');
        }

        throw error;
      }
    )
  }

  useEffect(() => {
    init();
    authStore.current.initialize();
    setupInterceptor(httpClientCtx);
  }, []);

  return {
    store: authStore.current,
    init,
    authorize,
    unauthorize,
  }
}

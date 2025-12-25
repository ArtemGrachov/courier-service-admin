import { useRef } from 'react';
import { useNavigate } from 'react-router';

import { useAuthCtx } from '~/providers/auth/hooks/use-auth-ctx';
import { useHttpClientCtx } from '~/providers/http-client';
import { LoginStore } from './store';

import type { IFormLogin } from '~/types/forms/form-login';
import type { ILoginResponse } from '~/types/api/auth';

import { ROUTES } from '~/router/routes';

export const useLoginService = () => {
  const { authorize } = useAuthCtx();
  const loginStore = useRef<LoginStore>(null as unknown as LoginStore);
  const navigate = useNavigate();
  const httpClient = useHttpClientCtx();

  if (!loginStore.current) {
    loginStore.current = new LoginStore();
  }

  const submit = async (formValue: IFormLogin) => {
    try {
      loginStore.current.doSubmitInit();
      const { data } = await httpClient.post<ILoginResponse>('/admin/auth/login', formValue);
      authorize(data.details.token);
      loginStore.current.doSubmitSuccess();
      navigate(ROUTES.HOME);
    } catch (err) {
      loginStore.current.doSubmitError(err);
      throw err;
    }
  }

  return {
    store: loginStore.current,
    submit,
  };
}

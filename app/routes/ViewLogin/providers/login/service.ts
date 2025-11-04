import { useRef } from 'react';
import { useNavigate } from 'react-router';

import { useAuthCtx } from '~/providers/auth/hooks/use-auth-ctx';
import { LoginStore } from './store';

import type { IFormLogin } from '~/types/forms/form-login';

import { mockRequest } from '~/utils/mock-request';
import { ROUTES } from '~/router/routes';

export const useLoginService = () => {
  const { authorize } = useAuthCtx();
  const loginStore = useRef<LoginStore>(null as unknown as LoginStore);
  const navigate = useNavigate();

  if (!loginStore.current) {
    loginStore.current = new LoginStore();
  }

  const submit = async (_formValue: IFormLogin) => {
    try {
      loginStore.current.doSubmitInit();
      await mockRequest();
      authorize('123123123');
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

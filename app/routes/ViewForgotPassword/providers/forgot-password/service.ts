import { useRef } from 'react';

import { ForgotPasswordStore } from './store';

import { useHttpClientCtx } from '~/providers/http-client';

import type { IFormForgotPassword } from '~/types/forms/form-forgot-password';

import type { IForgotPasswordResponse } from '~/types/api/auth';

export const useForgotPasswordService = () => {
  const httpClient = useHttpClientCtx();
  const forgotPasswordStore = useRef<ForgotPasswordStore>(null as unknown as ForgotPasswordStore);

  if (!forgotPasswordStore.current) {
    forgotPasswordStore.current = new ForgotPasswordStore();
  }

  const submit = async (formValue: IFormForgotPassword) => {
    try {
      forgotPasswordStore.current.doSubmitInit();
      await httpClient.post<IForgotPasswordResponse>('/admin/auth/forgot-password', formValue);
      forgotPasswordStore.current.doSubmitSuccess();
    } catch (err) {
      forgotPasswordStore.current.doSubmitError(err);
      throw err;
    }
  }

  return {
    store: forgotPasswordStore.current,
    submit,
  };
}

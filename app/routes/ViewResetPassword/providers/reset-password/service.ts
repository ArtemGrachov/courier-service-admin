import { useRef } from 'react';

import { ResetPasswordStore } from './store';

import { useHttpClientCtx } from '~/providers/http-client';

import type { IFormResetPassword } from '~/types/forms/form-reset-password';

export const useResetPasswordService = () => {
  const httpClient = useHttpClientCtx();
  const resetPasswordStore = useRef<ResetPasswordStore>(null as unknown as ResetPasswordStore);

  if (!resetPasswordStore.current) {
    resetPasswordStore.current = new ResetPasswordStore();
  }

  const submit = async (token: string, formValue: IFormResetPassword) => {
    try {
      const payload = {
        token,
        ...formValue,
      };

      resetPasswordStore.current.doSubmitInit();
      await httpClient.post('/admin/auth/reset-password', payload);
      resetPasswordStore.current.doSubmitSuccess();
    } catch (err) {
      resetPasswordStore.current.doSubmitError(err);
      throw err;
    }
  }

  return {
    store: resetPasswordStore.current,
    submit,
  };
}

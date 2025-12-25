import { useRef } from 'react';

import { ChangePasswordStore } from './store';

import { useHttpClientCtx } from '~/providers/http-client';

import type { IFormResetPassword } from '~/types/forms/form-reset-password';

export const useChangePasswordService = () => {
  const httpClient = useHttpClientCtx();
  const changePasswordStore = useRef<ChangePasswordStore>(null as unknown as ChangePasswordStore);

  if (!changePasswordStore.current) {
    changePasswordStore.current = new ChangePasswordStore();
  }

  const submit = async (token: string, formValue: IFormResetPassword) => {
    try {
      const payload = {
        token,
        ...formValue,
      };

      changePasswordStore.current.doSubmitInit();
      await httpClient.post('/admin/auth/change-password', payload);
      changePasswordStore.current.doSubmitSuccess();
    } catch (err) {
      changePasswordStore.current.doSubmitError(err);
      throw err;
    }
  }

  return {
    store: changePasswordStore.current,
    submit,
  };
}

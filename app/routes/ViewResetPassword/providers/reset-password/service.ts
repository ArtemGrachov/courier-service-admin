import { useRef } from 'react';

import { ResetPasswordStore } from './store';

import type { IFormResetPassword } from '~/types/forms/form-reset-password';

import { mockRequest } from '~/utils/mock-request';

export const useResetPasswordService = () => {
  const resetPasswordStore = useRef<ResetPasswordStore>(null as unknown as ResetPasswordStore);

  if (!resetPasswordStore.current) {
    resetPasswordStore.current = new ResetPasswordStore();
  }

  const submit = async (_formValue: IFormResetPassword) => {
    try {
      resetPasswordStore.current.doSubmitInit();
      await mockRequest();
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

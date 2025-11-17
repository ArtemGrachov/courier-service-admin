import { useRef } from 'react';

import { ForgotPasswordStore } from './store';

import type { IFormForgotPassword } from '~/types/forms/form-forgot-password';

import { mockRequest } from '~/utils/mock-request';

export const useForgotPasswordService = () => {
  const forgotPasswordStore = useRef<ForgotPasswordStore>(null as unknown as ForgotPasswordStore);

  if (!forgotPasswordStore.current) {
    forgotPasswordStore.current = new ForgotPasswordStore();
  }

  const submit = async (_formValue: IFormForgotPassword) => {
    try {
      forgotPasswordStore.current.doSubmitInit();
      await mockRequest();
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

import { useRef } from 'react';

import { UpsertCourierStore } from './store';

import type { IFormCourier } from '~/types/forms/form-courier';

import { mockRequest } from '~/utils/mock-request';

export const useUpsertCourierService = () => {
  const upsertCourierStore = useRef<UpsertCourierStore>(null as unknown as UpsertCourierStore);

  if (!upsertCourierStore.current) {
    upsertCourierStore.current = new UpsertCourierStore();
  }

  const submitCreate = async (_formValue: IFormCourier) => {
    try {
      upsertCourierStore.current.doSubmitInit();
      await mockRequest();
      upsertCourierStore.current.doSubmitSuccess();
    } catch (err) {
      upsertCourierStore.current.doSubmitError(err);
      throw err;
    }
  }

  return {
    store: upsertCourierStore.current,
    submitCreate,
  };
}

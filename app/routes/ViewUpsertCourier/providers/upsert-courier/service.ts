import { useRef } from 'react';

import { Cache } from '~/cache/Cache';
import { UpsertCourierStore } from './store';

import { useHttpClientCtx } from '~/providers/http-client';

import type { IFormCourier } from '~/types/forms/form-courier';

export const useUpsertCourierService = () => {
  const httpClientCtx = useHttpClientCtx();
  const upsertCourierStore = useRef<UpsertCourierStore>(null as unknown as UpsertCourierStore);

  if (!upsertCourierStore.current) {
    upsertCourierStore.current = new UpsertCourierStore();
  }

  const submitCreate = async (formValue: IFormCourier) => {
    try {
      upsertCourierStore.current.doSubmitInit();
      await httpClientCtx.post('/courier', formValue);
      upsertCourierStore.current.doSubmitSuccess();
      Cache.instance.clear();
    } catch (err) {
      upsertCourierStore.current.doSubmitError(err);
      throw err;
    }
  }

  const submitUpdate = async (courierId: number, formValue: IFormCourier) => {
    try {
      upsertCourierStore.current.doSubmitInit();
      await httpClientCtx.patch(`/courier/${courierId}`, formValue);
      upsertCourierStore.current.doSubmitSuccess();
      Cache.instance.clear();
    } catch (err) {
      upsertCourierStore.current.doSubmitError(err);
      throw err;
    }
  }

  return {
    store: upsertCourierStore.current,
    submitCreate,
    submitUpdate,
  };
}

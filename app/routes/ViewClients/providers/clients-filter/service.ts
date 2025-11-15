import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';

import { ClientsFilterStore } from './store';

import type { IFormClientsFilter } from '~/types/forms/form-clients-filter';

import { formValueToRouteQuery, routeQueryToFormValue } from './utils';

export const useClientsFilterService = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const store = useRef<ClientsFilterStore>(null as unknown as ClientsFilterStore);

  const handleUpdate = useCallback((formValue: IFormClientsFilter) => {
    const newSearchParams = formValueToRouteQuery(formValue);

    setSearchParams(newSearchParams);
  }, []);

  useEffect(() => {
    const newFormValue = routeQueryToFormValue(searchParams);
    const currentFormValue = store.current.formValue;

    store.current.updateFormValue({
      ...currentFormValue,
      ...newFormValue,
    });
  }, [searchParams]);

  if (!store.current) {
    store.current = new ClientsFilterStore({ formValue: routeQueryToFormValue(searchParams) });
  }

  return {
    handleUpdate,
    store: store.current,
  };
}

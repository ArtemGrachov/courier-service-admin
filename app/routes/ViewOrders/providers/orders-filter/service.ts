import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';

import { OrdersFilterStore } from './store';

import type { IFormOrdersFilter } from '~/types/forms/form-orders-filter';

import { formValueToRouteQuery, routeQueryToFormValue } from './utils';

export const useOrdersFilterService = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const store = useRef<OrdersFilterStore>(null as unknown as OrdersFilterStore);

  const handleUpdate = useCallback((formValue: IFormOrdersFilter) => {
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
    store.current = new OrdersFilterStore({ formValue: routeQueryToFormValue(searchParams) });
  }

  return {
    handleUpdate,
    store: store.current,
  };
}

import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';

import { CouriersFiltersStore } from './store';

import type { IFormCouriersFilter } from '~/types/forms/form-couriers-filter';
import { formValueToRouteQuery, routeQueryToFormValue } from './utils';

export const useCouriersFiltersService = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const store = useRef<CouriersFiltersStore>(null as unknown as CouriersFiltersStore);

  const handleUpdate = useCallback((formValue: IFormCouriersFilter) => {
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
    store.current = new CouriersFiltersStore({ formValue: routeQueryToFormValue(searchParams) });
  }

  return {
    handleUpdate,
    store: store.current,
  };
}

import { useCallback, useEffect, useRef } from 'react';
import { createSearchParams, useSearchParams, type URLSearchParamsInit } from 'react-router'

import { EOrderStatus, ORDER_STATUSES } from '~/constants/order';
import { MapFiltersStore } from './store';

import type { IFormMapFilters } from '~/types/forms/form-map-filters'

export const useMapFiltersService = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const store = useRef<MapFiltersStore>(null as unknown as MapFiltersStore);

  const handleUpdate = useCallback((formValue: IFormMapFilters) => {
    const newSearchParams = formValueToRouteQuery(formValue);

    setSearchParams(newSearchParams);
  }, []);

  const formValueToRouteQuery = useCallback((formValue: IFormMapFilters) => {
    const params: URLSearchParamsInit = {};

    if (formValue.statuses) {
      params.statuses = formValue.statuses;
    }

    if (formValue.sendersIds) {
      params.senders = formValue.sendersIds.map(id => id.toString());
    }

    if (formValue.receiverIds) {
      params.receivers = formValue.receiverIds.map(id => id.toString());
    }

    if (formValue.courierIds) {
      params.couriers = formValue.courierIds.map(id => id.toString());
    }

    return createSearchParams(params);
  }, []);

  const routeQueryToFormValue = useCallback((newSearchParams: URLSearchParams) => {
    const statuses = newSearchParams
      .getAll('statuses')
      .filter(s => ORDER_STATUSES.includes(s as EOrderStatus)) as EOrderStatus[];
    const courierIds = newSearchParams
      .getAll('couriers')
      .map(rawId => +rawId)
      .filter(id => !isNaN(id));
    const sendersIds = newSearchParams
      .getAll('senders')
      .map(rawId => +rawId)
      .filter(id => !isNaN(id));
    const receiverIds = newSearchParams
      .getAll('receivers')
      .map(rawId => +rawId)
      .filter(id => !isNaN(id));

    const newFormValue: IFormMapFilters = {
      statuses,
      courierIds,
      sendersIds,
      receiverIds,
    };

    return newFormValue;
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
    store.current = new MapFiltersStore({ formValue: routeQueryToFormValue(searchParams) });
  }

  return {
    handleUpdate,
    store: store.current,
  };
}

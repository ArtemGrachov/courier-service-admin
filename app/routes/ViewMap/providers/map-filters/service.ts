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

    if (formValue.orderId) {
      params.order = formValue.orderId;
    }

    if (formValue.status) {
      params.status = formValue.status;
    }

    if (formValue.senderIds) {
      params.senders = formValue.senderIds.map(id => id.toString());
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
    const orderId = newSearchParams.get('order');
    const rawStatus = newSearchParams.get('status');
    const courierIds = newSearchParams
      .getAll('couriers')
      .map(rawId => +rawId)
      .filter(id => !isNaN(id));
    const senderIds = newSearchParams
      .getAll('senders')
      .map(rawId => +rawId)
      .filter(id => !isNaN(id));
    const receiverIds = newSearchParams
      .getAll('receivers')
      .map(rawId => +rawId)
      .filter(id => !isNaN(id));

    const status = ORDER_STATUSES.includes(rawStatus as EOrderStatus) ? rawStatus as EOrderStatus : null;

    const newFormValue: IFormMapFilters = {
      orderId,
      status,
      courierIds,
      senderIds,
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

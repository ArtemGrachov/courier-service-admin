import { createSearchParams, type URLSearchParamsInit } from 'react-router';

import { DEFAULT_ORDER_QUERY } from '../../constants/orders-filters';
import { ORDER_STATUSES } from '~/constants/order';

import type { IFormOrdersFilter } from '~/types/forms/form-orders-filter';

export const formValueToRouteQuery = (formValue: IFormOrdersFilter) => {
  const params: URLSearchParamsInit = {};

  if (formValue.page != null && formValue.page !== DEFAULT_ORDER_QUERY.page) {
    params.page = formValue.page.toString();
  }

  if (formValue.itemsPerPage && formValue.itemsPerPage !== DEFAULT_ORDER_QUERY.itemsPerPage) {
    params.itemsPerPage = formValue.itemsPerPage.toString();
  }

  if (formValue.statuses) {
    params.status = formValue.statuses;
  }

  return createSearchParams(params);
}

export const routeQueryToFormValue = (newSearchParams: URLSearchParams) => {
  let page = DEFAULT_ORDER_QUERY.page;
  let itemsPerPage = DEFAULT_ORDER_QUERY.itemsPerPage;

  const rawPage = newSearchParams.get('page');
  const rawItemsPerPage = newSearchParams.get('itemsPerPage');
  const statuses = ORDER_STATUSES.filter(s => s === newSearchParams.get('statuses'));

  if (rawPage != null) {
    const numPage = +rawPage;

    if (!isNaN(numPage)) {
      page = numPage;
    }
  }

  if (rawItemsPerPage != null) {
    const numItemsPerPage = +rawItemsPerPage;

    if (!isNaN(numItemsPerPage)) {
      itemsPerPage = numItemsPerPage;
    }
  }

  const newFormValue: IFormOrdersFilter = {
    page,
    itemsPerPage,
    statuses,
  };

  return newFormValue;
}


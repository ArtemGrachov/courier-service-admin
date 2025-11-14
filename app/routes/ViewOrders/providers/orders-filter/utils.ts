import { createSearchParams, type URLSearchParamsInit } from 'react-router';

import { DEFAULT_ORDER_QUERY } from '../../constants/orders-filter';
import { ORDER_STATUSES } from '~/constants/order';

import type { IFormOrdersFilter } from '~/types/forms/form-orders-filter';

import { validateSort } from '~/utils/validate-sort';

export const formValueToRouteQuery = (formValue: IFormOrdersFilter) => {
  const params: URLSearchParamsInit = {};

  if (formValue.page != null && formValue.page !== DEFAULT_ORDER_QUERY.page) {
    params.page = formValue.page.toString();
  }

  if (formValue.itemsPerPage && formValue.itemsPerPage !== DEFAULT_ORDER_QUERY.itemsPerPage) {
    params.itemsPerPage = formValue.itemsPerPage.toString();
  }

  if (formValue.statuses) {
    params.statuses = formValue.statuses;
  }

  if (formValue.dateTimeOrderedSort) {
    params.dateTimeOrderedSort = formValue.dateTimeOrderedSort;
  }

  if (formValue.dateTimeClosedSort) {
    params.dateTimeClosedSort = formValue.dateTimeClosedSort;
  }

  return createSearchParams(params);
}

export const routeQueryToFormValue = (newSearchParams: URLSearchParams) => {
  let page = DEFAULT_ORDER_QUERY.page;
  let itemsPerPage = DEFAULT_ORDER_QUERY.itemsPerPage;

  const rawPage = newSearchParams.get('page');
  const rawItemsPerPage = newSearchParams.get('itemsPerPage');
  const rawStatuses = newSearchParams.getAll('statuses');
  const rawStatusesSet = new Set(rawStatuses);
  const dateTimeOrderedSort = validateSort(newSearchParams.get('dateTimeOrderedSort'));
  const dateTimeClosedSort = validateSort(newSearchParams.get('dateTimeClosedSort'));
  const statuses = ORDER_STATUSES.filter(s => rawStatusesSet.has(s));

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
    statuses: statuses.length ? statuses : undefined,
    dateTimeOrderedSort,
    dateTimeClosedSort,
  };

  return newFormValue;
}


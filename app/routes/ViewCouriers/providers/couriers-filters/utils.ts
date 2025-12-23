import { createSearchParams, type URLSearchParamsInit } from 'react-router';

import { DEFAULT_COURIER_FILTERS } from '~/constants/couriers';
import { COURIER_STATUSES } from '~/constants/couriers';

import type { IFormCouriersFilter } from '~/types/forms/form-couriers-filter';

import { validateSort } from '~/utils/validate-sort';

export const formValueToRouteQuery = (formValue: IFormCouriersFilter) => {
  const params: URLSearchParamsInit = {};

  if (formValue.page != null && formValue.page !== DEFAULT_COURIER_FILTERS.page) {
    params.page = formValue.page.toString();
  }

  if (formValue.itemsPerPage && formValue.itemsPerPage !== DEFAULT_COURIER_FILTERS.itemsPerPage) {
    params.itemsPerPage = formValue.itemsPerPage.toString();
  }

  if (formValue.nameSearch) {
    params.nameSearch = formValue.nameSearch;
  }

  if (formValue.phoneSearch) {
    params.phoneSearch = formValue.phoneSearch;
  }

  if (formValue.emailSearch) {
    params.emailSearch = formValue.emailSearch;
  }

  if (formValue.nameSort) {
    params.nameSort = formValue.nameSort;
  }

  if (formValue.ratingSort) {
    params.ratingSort = formValue.ratingSort;
  }

  if (formValue.activeOrdersCountSort) {
    params.activeOrdersCountSort = formValue.activeOrdersCountSort;
  }

  if (formValue.completedOrdersCountSort) {
    params.completedOrdersCountSort = formValue.completedOrdersCountSort;
  }

  if (formValue.totalOrdersCountSort) {
    params.totalOrdersCountSort = formValue.totalOrdersCountSort;
  }

  if (formValue.statuses) {
    params.statuses = formValue.statuses;
  }

  return createSearchParams(params);
}

export const routeQueryToFormValue = (newSearchParams: URLSearchParams) => {
  let page = DEFAULT_COURIER_FILTERS.page;
  let itemsPerPage = DEFAULT_COURIER_FILTERS.itemsPerPage;

  const rawPage = newSearchParams.get('page');
  const rawItemsPerPage = newSearchParams.get('itemsPerPage');
  const rawStatuses = newSearchParams.getAll('statuses');
  const rawStatusesSet = new Set(rawStatuses);
  const nameSearch = newSearchParams.get('nameSearch');
  const emailSearch = newSearchParams.get('emailSearch');
  const phoneSearch = newSearchParams.get('phoneSearch');
  const nameSort = validateSort(newSearchParams.get('nameSort'));
  const activeOrdersCountSort = validateSort(newSearchParams.get('activeOrdersCountSort'));
  const completedOrdersCountSort = validateSort(newSearchParams.get('completedOrdersCountSort'));
  const totalOrdersCountSort = validateSort(newSearchParams.get('totalOrdersCountSort'));
  const ratingSort = validateSort(newSearchParams.get('ratingSort'));
  const statuses = COURIER_STATUSES.filter(s => rawStatusesSet.has(s));

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

  const newFormValue: IFormCouriersFilter = {
    page,
    itemsPerPage,
    nameSearch,
    emailSearch,
    phoneSearch,
    statuses,
    nameSort,
    activeOrdersCountSort,
    completedOrdersCountSort,
    totalOrdersCountSort,
    ratingSort,
  };

  return newFormValue;
}


import { createSearchParams, type URLSearchParamsInit } from 'react-router';

import { DEFAULT_CLIENT_FILTERS } from '~/constants/clients';

import type { IFormClientsFilter } from '~/types/forms/form-clients-filter';

import { validateSort } from '~/utils/validate-sort';

export const formValueToRouteQuery = (formValue: IFormClientsFilter) => {
  const params: URLSearchParamsInit = {};

  if (formValue.page != null && formValue.page !== DEFAULT_CLIENT_FILTERS.page) {
    params.page = formValue.page.toString();
  }

  if (formValue.itemsPerPage && formValue.itemsPerPage !== DEFAULT_CLIENT_FILTERS.itemsPerPage) {
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

  return createSearchParams(params);
}

export const routeQueryToFormValue = (newSearchParams: URLSearchParams) => {
  let page = DEFAULT_CLIENT_FILTERS.page;
  let itemsPerPage = DEFAULT_CLIENT_FILTERS.itemsPerPage;

  const rawPage = newSearchParams.get('page');
  const rawItemsPerPage = newSearchParams.get('itemsPerPage');
  const nameSearch = newSearchParams.get('nameSearch');
  const emailSearch = newSearchParams.get('emailSearch');
  const phoneSearch = newSearchParams.get('phoneSearch');
  const nameSort = validateSort(newSearchParams.get('nameSort'));
  const activeOrdersCountSort = validateSort(newSearchParams.get('activeOrdersCountSort'));
  const completedOrdersCountSort = validateSort(newSearchParams.get('completedOrdersCountSort'));
  const totalOrdersCountSort = validateSort(newSearchParams.get('totalOrdersCountSort'));
  const ratingSort = validateSort(newSearchParams.get('ratingSort'));

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

  const newFormValue: IFormClientsFilter = {
    page,
    itemsPerPage,
    nameSearch,
    emailSearch,
    phoneSearch,
    nameSort,
    activeOrdersCountSort,
    completedOrdersCountSort,
    totalOrdersCountSort,
    ratingSort,
  };

  return newFormValue;
}


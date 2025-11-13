import { createSearchParams, type URLSearchParamsInit } from 'react-router';

import { DEFAULT_COURIER_FILTERS } from '../../constants/couriers-filters';

import type { IFormCouriersFilter } from '~/types/forms/form-couriers-filter';

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

  return createSearchParams(params);
}

export const routeQueryToFormValue = (newSearchParams: URLSearchParams) => {
  let page = DEFAULT_COURIER_FILTERS.page;
  let itemsPerPage = DEFAULT_COURIER_FILTERS.itemsPerPage;

  const rawPage = newSearchParams.get('page');
  const rawItemsPerPage = newSearchParams.get('itemsPerPage');
  const nameSearch = newSearchParams.get('nameSearch');
  const emailSearch = newSearchParams.get('emailSearch');
  const phoneSearch = newSearchParams.get('phoneSearch');

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
  };

  return newFormValue;
}


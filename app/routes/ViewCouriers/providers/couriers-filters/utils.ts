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

  return createSearchParams(params);
}

export const routeQueryToFormValue = (newSearchParams: URLSearchParams) => {
  let page = DEFAULT_COURIER_FILTERS.page;
  let itemsPerPage = DEFAULT_COURIER_FILTERS.itemsPerPage;

  const rawPage = newSearchParams.get('page');
  const rawItemsPerPage = newSearchParams.get('itemsPerPage');

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
  };

  return newFormValue;
}


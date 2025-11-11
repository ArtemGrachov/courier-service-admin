import type { Route } from '.react-router/types/app/routes/ViewMap/+types/ViewMap';

import { DEFAULT_COURIER_QUERY } from '../constants/couriers-filters';
import { EStatus } from '~/constants/status';

import { routeQueryToFormValue } from '../providers/couriers-filters/utils';

import { fetchCouriers } from '~/data/fetch-couriers';
import type { ICouriersStoreData } from '~/store/couriers.store';

import type { IGetCouriersQuery } from '~/types/api/couriers';

export async function loadCouriers({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const couriersState: ICouriersStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  const formValue = routeQueryToFormValue(searchParams);

  const fetchCouriersQuery: IGetCouriersQuery = DEFAULT_COURIER_QUERY;

  if (formValue.page != null) {
    fetchCouriersQuery.page = formValue.page;
  }

  if (fetchCouriersQuery.itemsPerPage != null) {
    fetchCouriersQuery.itemsPerPage = formValue.itemsPerPage;
  }

  try {
    const data = await fetchCouriers(fetchCouriersQuery);
    couriersState.data = data;
    couriersState.getStatus = EStatus.SUCCESS;
  } catch (err) {
    couriersState.getError = err;
    couriersState.getStatus = EStatus.ERROR;
  }

  return couriersState;
}

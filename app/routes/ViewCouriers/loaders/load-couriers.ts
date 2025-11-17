import { DEFAULT_COURIER_QUERY } from '~/constants/couriers';
import { EStatus } from '~/constants/status';

import { routeQueryToFormValue } from '../providers/couriers-filters/utils';

import { fetchCouriers } from '~/data/fetch-couriers';
import type { ICouriersStoreData } from '~/store/couriers.store';

import type { IGetCouriersQuery } from '~/types/api/couriers';

export async function loadCouriers(requestUrl: string) {
  const url = new URL(requestUrl);
  const searchParams = url.searchParams;

  const couriersState: ICouriersStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  const formValue = routeQueryToFormValue(searchParams);

  const fetchCouriersQuery: IGetCouriersQuery = DEFAULT_COURIER_QUERY;

  Object.assign(fetchCouriersQuery, formValue);

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

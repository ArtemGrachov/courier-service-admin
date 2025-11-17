import { EStatus } from '~/constants/status';

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

  const courierIds = searchParams
    .getAll('couriers')
    .map(rawId => +rawId);

  const fetchCouriersQuery: IGetCouriersQuery = {};

  if (courierIds.length) {
    fetchCouriersQuery.courierIds = courierIds;
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

import type { Route } from '.react-router/types/app/routes/ViewMap/+types/ViewMap';

import { EStatus } from '~/constants/status';

import { fetchCouriers } from '~/providers/couriers/data';
import type { ICouriersStoreData } from '~/providers/couriers/store';

import type { IGetCouriersQuery } from '~/types/api/couriers';

export async function loadCouriers({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
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

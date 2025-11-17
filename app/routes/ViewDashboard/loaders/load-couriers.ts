import { ECourierStatus } from '~/constants/couriers';
import { EStatus } from '~/constants/status';

import { fetchCouriers } from '~/data/fetch-couriers';
import type { ICouriersStoreData } from '~/store/couriers.store';

import type { IGetCouriersQuery } from '~/types/api/couriers';

export async function loadCouriers() {
  const couriersState: ICouriersStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  const fetchCouriersQuery: IGetCouriersQuery = {
    status: ECourierStatus.DELIVERING,
    itemsPerPage: 5,
  };

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


import { EStatus } from '~/constants/status';

import { fetchCourier } from '~/providers/courier/data';
import type { ICourierStoreData } from '~/providers/courier/store';

export async function loadCourier(courierId: number) {
  const courierState: ICourierStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  try {
    const data = await fetchCourier(courierId);
    courierState.data = data;
    courierState.getStatus = EStatus.SUCCESS;
  } catch (err) {
    courierState.getError = err;
    courierState.getStatus = EStatus.ERROR;
  }

  return courierState;
}

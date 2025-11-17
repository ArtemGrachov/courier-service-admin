import { EStatus } from '~/constants/status';

import { fetchClient } from '~/providers/client/data';
import type { IClientStoreData } from '~/providers/client/store';

export async function loadClient(clientId: number) {
  const clientState: IClientStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  try {
    const data = await fetchClient(clientId);
    clientState.data = data;
    clientState.getStatus = EStatus.SUCCESS;
  } catch (err) {
    clientState.getError = err;
    clientState.getStatus = EStatus.ERROR;
  }

  return clientState;
}

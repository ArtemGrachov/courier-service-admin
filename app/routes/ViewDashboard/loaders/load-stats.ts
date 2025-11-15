import { EStatus } from '~/constants/status';

import { fetchStats } from '~/data/fetch-stats';

import type { IStatsStoreData } from '~/providers/stats/store';

export async function loadStats() {
  const statsState: IStatsStoreData = {
    getStatus: EStatus.INIT,
    getError: null,
    data: null,
  };

  try {
    const data = await fetchStats();
    statsState.data = data;
    statsState.getStatus = EStatus.SUCCESS;
  } catch (err) {
    statsState.getError = err;
    statsState.getStatus = EStatus.ERROR;
  }

  return statsState;
}


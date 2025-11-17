import { useRef } from 'react';

import { StatsStore, type IStatsStoreData } from './store';

export const useStatsService = (initialData?: IStatsStoreData) => {
  const statsStore = useRef<StatsStore>(null as unknown as StatsStore);

  if (!statsStore.current) {
    statsStore.current = new StatsStore(initialData);
  }

  const setProcessing = () => {
    statsStore.current.doGetInit();
  }

  return {
    store: statsStore.current,
    setProcessing,
  };
}


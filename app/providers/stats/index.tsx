import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useStatsService } from './service';

import type { IStatsStoreData } from './store';

export const StatsContext = createContext<ReturnType<typeof useStatsService>>(null as any);

interface IProps {
  initialData?: IStatsStoreData;
}

export const StatsProvider: ComponentType<PropsWithChildren & IProps> = ({ children, initialData }) => {
  const statsService = useStatsService(initialData);

  return (
    <StatsContext.Provider value={statsService}>
      {children}
    </StatsContext.Provider>
  )
}

export const useStatsCtx = () => useContext(StatsContext);

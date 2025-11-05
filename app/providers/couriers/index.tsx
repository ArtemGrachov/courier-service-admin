import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useCouriersService } from './service';

import type { IGetCouriersResponse } from '~/types/api/couriers';

export const CouriersContext = createContext<ReturnType<typeof useCouriersService>>(null as any);

interface IProps {
  initialData?: IGetCouriersResponse;
}

export const CouriersProvider: ComponentType<PropsWithChildren & IProps> = ({ children, initialData }) => {
  const couriersService = useCouriersService(initialData);

  return (
    <CouriersContext.Provider value={couriersService}>
      {children}
    </CouriersContext.Provider>
  )
}

export const useCouriersCtx = () => useContext(CouriersContext);

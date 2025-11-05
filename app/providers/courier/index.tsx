import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';

import { useCourierService } from './service';

import type { ICourierStoreData } from '~/providers/courier/store';

export const CourierContext = createContext<ReturnType<typeof useCourierService>>(null as any);

interface IProps {
  initialData?: ICourierStoreData;
}

export const CourierProvider: ComponentType<PropsWithChildren & IProps> = ({ children, initialData }) => {
  const courierService = useCourierService(initialData);

  return (
    <CourierContext.Provider value={courierService}>
      {children}
    </CourierContext.Provider>
  )
}

export const useCourierCtx = () => useContext(CourierContext);

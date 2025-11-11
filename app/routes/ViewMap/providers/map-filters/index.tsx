import { createContext, useContext, type ComponentType, type PropsWithChildren } from 'react';
import { useMapFiltersService } from './service';

export const MapFiltersContext = createContext<ReturnType<typeof useMapFiltersService>>(null as any);

export const MapFiltersProvider: ComponentType<PropsWithChildren> = ({ children }) => {
  const service = useMapFiltersService();

  return (
    <MapFiltersContext.Provider value={service}>
      {children}
    </MapFiltersContext.Provider>
  )
}

export const useMapFiltersCtx = () => useContext(MapFiltersContext);

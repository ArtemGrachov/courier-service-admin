import { useContext, createContext, type ComponentType, type PropsWithChildren } from 'react';

import { usePageDataService, type IOptions } from './service';

export const PageDataContext = createContext<ReturnType<typeof usePageDataService>>(null as unknown as any);

export const PageDataProvider: ComponentType<PropsWithChildren & IOptions> = ({ children, initialData, loader }) => {
  const service = usePageDataService({ initialData, loader });

  return (
    <PageDataContext.Provider value={service}>
      {children}
    </PageDataContext.Provider>
  )
}

export const usePageDataCtx = () => useContext(PageDataContext);


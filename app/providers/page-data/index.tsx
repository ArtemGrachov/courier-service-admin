import { useContext, createContext, type ComponentType, type PropsWithChildren } from 'react';

import { usePageDataService, type IOptions } from './service';

export const PageDataContext = createContext<ReturnType<typeof usePageDataService>>(null as unknown as any);

export const usePageDataCtx = () => useContext(PageDataContext);


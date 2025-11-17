import { createContext, useContext, type ComponentType, type PropsWithChildren, type RefObject } from 'react';

export const TitlePortalContext = createContext<RefObject<HTMLElement | null> | null>(null);

interface IProps {
  ref: RefObject<HTMLElement | null>;
}

export const TitlePortalProvider: ComponentType<PropsWithChildren & IProps> = ({ children, ref }) => {
  return (
    <TitlePortalContext.Provider value={ref}>
      {children}
    </TitlePortalContext.Provider>
  )
}

export const useTitlePortalCtx = () => useContext(TitlePortalContext);


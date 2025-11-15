import { useRef, type ComponentType } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Navigate, Outlet } from 'react-router';
import { observer } from 'mobx-react-lite';

import { ROUTES } from '~/router/routes';

import { useAuthCtx } from '~/providers/auth/hooks/use-auth-ctx';
import { RouteKeyProvider, useRouteKeyCtx } from '~/providers/route-key';
import { TitlePortalProvider } from '~/providers/title-portal';

import { useRoutePath } from '~/hooks/routing/use-route-path';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const LayoutDefault: ComponentType = observer(() => {
  const { store } = useAuthCtx();
  const routePath = useRoutePath();
  const { routeKey } = useRouteKeyCtx()!;
  const titleRef = useRef<HTMLDivElement | null>(null);

  if (!store.isInitialized) {
    return null;
  }

  if (!store.isAuthorized) {
    return <Navigate to={routePath(ROUTES.LOGIN)} />
  }

  return (
    <Box
      display="flex"
      boxSizing="border-box"
      minHeight="100%"
    >
      <Header title={<div ref={titleRef} />} />
      <Sidebar />
      <Box
        component="main"
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        minWidth={0}
        boxSizing="border-box"
      >
        <Toolbar />
        <TitlePortalProvider ref={titleRef}>
          <Outlet key={routeKey} />
        </TitlePortalProvider>
      </Box>
    </Box>
  )
});

const Wrapper: ComponentType = () => {
  return (
    <RouteKeyProvider>
      <LayoutDefault />
    </RouteKeyProvider>
  )
}

export default Wrapper;


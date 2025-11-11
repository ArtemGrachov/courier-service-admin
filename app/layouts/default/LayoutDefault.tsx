import { Box, Toolbar } from '@mui/material';
import type { ComponentType } from 'react';
import { Navigate, Outlet } from 'react-router';
import { observer } from 'mobx-react-lite';

import { ROUTES } from '~/router/routes';

import { useAuthCtx } from '~/providers/auth/hooks/use-auth-ctx';
import { RouteKeyProvider, useRouteKeyCtx } from '~/providers/route-key';

import { useRoutePath } from '~/hooks/routing/use-route-path';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const LayoutDefault: ComponentType = observer(() => {
  const { store } = useAuthCtx();
  const routePath = useRoutePath();
  const { routeKey } = useRouteKeyCtx()!;

  if (!store.isAuthorized) {
    return <Navigate to={routePath(ROUTES.LOGIN)} />
  }

  return (
    <Box
      display="flex"
      boxSizing="border-box"
      minHeight="100%"
    >
      <Header />
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
        <Outlet key={routeKey} />
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

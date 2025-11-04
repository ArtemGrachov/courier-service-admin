import { Box, Toolbar } from '@mui/material';
import type { ComponentType } from 'react';
import { Navigate, Outlet } from 'react-router';
import { observer } from 'mobx-react-lite';

import { ROUTES } from '~/router/routes';

import { useAuthCtx } from '~/providers/auth/hooks/use-auth-ctx';

import { useRoutePath } from '~/hooks/routing/use-route-path';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const LayoutDefault: ComponentType = observer(() => {
  const { store } = useAuthCtx();
  const routePath = useRoutePath();

  if (!store.isAuthorized) {
    return <Navigate to={routePath(ROUTES.LOGIN)} />
  }

  return (
    <Box sx={{ display: 'flex '}}>
      <Header />
      <Sidebar />
      <Box component="main" width="100%">
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
});

export default LayoutDefault;

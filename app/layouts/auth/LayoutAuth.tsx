import type { ComponentType } from 'react';
import { Navigate, Outlet } from 'react-router';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router';

import { ROUTES } from '~/router/routes';

import { useAuthCtx } from '~/providers/auth/hooks/use-auth-ctx';

import { useRoutePath } from '~/hooks/routing/use-route-path';
import LanguageSwitch from '~/components/other/LanguageSwitch';
import ThemeSwitch from '~/components/other/ThemeSwitch';

const LayoutAuth: ComponentType = () => {
  const { store } = useAuthCtx();
  const routePath = useRoutePath();

  if (store.isAuthorized) {
    return <Navigate to={routePath(ROUTES.HOME)} />
  }

  return (
    <Stack direction="column" alignItems="stretch" height="100%">
      <Toolbar>
        <Stack
          sx={{ marginLeft: 'auto' }}
          direction="row"
          spacing={1}
        >
          <LanguageSwitch />
          <ThemeSwitch />
        </Stack>
      </Toolbar>
      <Box margin="auto" display="flex" justifyContent="center" width="100%">
        <Outlet />
      </Box>
      <Box padding={4} display="flex" justifyContent="center">
        <Link
          to={routePath(ROUTES.ABOUT)}
          component={RouterLink}
        >
          About the project
        </Link>
      </Box>
    </Stack>
  )
}

export default LayoutAuth;

import type { ComponentType } from 'react';
import { Outlet } from 'react-router';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { ROUTES } from '~/router/routes';

import { useRoutePath } from '~/hooks/routing/use-route-path';
import LanguageSwitch from '~/components/other/LanguageSwitch';
import ThemeSwitch from '~/components/other/ThemeSwitch';

const LayoutGeneral: ComponentType = () => {
  const routePath = useRoutePath();

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
      <Container>
        <Outlet />
      </Container>
    </Stack>
  )
}

export default LayoutGeneral;

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import type { ComponentType } from 'react';
import { Outlet } from 'react-router';

const LayoutAuth: ComponentType = () => {
  return (
    <Stack direction="column" alignItems="center" justifyContent="center" height="100%">
      <Outlet />
    </Stack>
  )
}

export default LayoutAuth;

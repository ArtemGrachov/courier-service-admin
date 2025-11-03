import { Box } from '@mui/material';
import type { ComponentType } from 'react';
import { Outlet } from 'react-router';

import Sidebar from '~/layouts/default/components/Sidebar';

const LayoutDefault: ComponentType = () => {
  return (
    <Box sx={{ display: 'flex '}}>
      <Sidebar />
      <Outlet />
    </Box>
  )
}

export default LayoutDefault;

import { Box, Toolbar } from '@mui/material';
import type { ComponentType } from 'react';
import { Outlet } from 'react-router';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

const LayoutDefault: ComponentType = () => {
  return (
    <Box sx={{ display: 'flex '}}>
      <Header />
      <Sidebar />
      <Box component="main">
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}

export default LayoutDefault;

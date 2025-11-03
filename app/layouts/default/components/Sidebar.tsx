import { type ComponentType } from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';

import Navigation from './Navigation';
import Logout from './Logout';

const drawerWidth = 240;

const Sidebar: ComponentType = () => {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
    >
      <Toolbar />
      <Navigation />
      <Divider sx={{ marginTop: 'auto' }} />
      <Logout />
    </Drawer>
  )
}

export default Sidebar;

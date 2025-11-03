import type { ComponentType } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';

import ThemeSwitch from '~/components/other/ThemeSwitch';
import LanguageSwitch from '~/components/other/LanguageSwitch';

const Header: ComponentType = () => {
  return (
    <AppBar position="absolute" sx={{ zIndex: 1201 }}>
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
    </AppBar>
  )
}

export default Header;

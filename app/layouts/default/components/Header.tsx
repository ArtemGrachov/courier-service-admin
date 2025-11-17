import type { ComponentType, ReactNode } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ThemeSwitch from '~/components/other/ThemeSwitch';
import LanguageSwitch from '~/components/other/LanguageSwitch';

interface IProps {
  title?: ReactNode | null;
}

const Header: ComponentType<IProps> = ({ title }) => {
  return (
    <AppBar position="absolute" sx={{ zIndex: 1201 }}>
      <Toolbar>
        <Typography variant="h6" component="h1">
          {title}
        </Typography>
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

import type { ComponentType } from 'react';
import { useColorScheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const ThemeSwitch: ComponentType = () => {
  const { mode, setMode } = useColorScheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const toggleMode = () => {
    switch (mode) {
      case 'dark': {
        setMode('light');
        break;
      }
      case 'light': {
        setMode('dark');
        break;
      }
      case 'system': {
        if (prefersDarkMode) {
          setMode('light');
        } else {
          setMode('dark');
        }
        break;
      }
    }
  }

  return (
    <IconButton onClick={toggleMode}>
      <DarkModeIcon />
    </IconButton>
  )
}

export default ThemeSwitch;

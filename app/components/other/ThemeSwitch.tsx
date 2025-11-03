import type { ComponentType } from 'react';
import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const ThemeSwitch: ComponentType = () => {
  return (
    <IconButton>
      <DarkModeIcon />
    </IconButton>
  )
}

export default ThemeSwitch;

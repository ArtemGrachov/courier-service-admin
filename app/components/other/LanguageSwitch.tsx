import { useRef, useState, type ComponentType, type ReactNode } from 'react';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

const LanguageSwitch: ComponentType = () => {
  const anchorRef = useRef<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const clickHandler = () => {
    setIsOpen(!isOpen);
  }

  const closeHandler = () => {
    setIsOpen(false);
  }

  const selectHandler = () => {
    closeHandler();
  }

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={clickHandler}
      >
        <Typography variant="subtitle2" width={24} component={'span'} lineHeight={1}>
          EN
        </Typography>
      </IconButton>
      <Menu
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={closeHandler}
      >
        <MenuItem onClick={selectHandler}>
          EN
        </MenuItem>
        <MenuItem onClick={selectHandler}>
          UK
        </MenuItem>
      </Menu>
    </>
  )
}

export default LanguageSwitch;

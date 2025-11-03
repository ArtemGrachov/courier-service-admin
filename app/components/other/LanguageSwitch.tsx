import { useRef, useState, type ComponentType } from 'react';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { useLanguageSwitch } from '~/hooks/i18n/use-language-switch';

const LanguageSwitch: ComponentType = () => {
  const anchorRef = useRef<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { currentLocaleLabel, options, changeLocale: switchHandler } = useLanguageSwitch();

  const clickHandler = () => {
    setIsOpen(!isOpen);
  }

  const closeHandler = () => {
    setIsOpen(false);
  }

  const selectHandler = (locale: string) => {
    switchHandler(locale);
    closeHandler();
  }

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={clickHandler}
      >
        <Typography variant="subtitle2" width={24} component={'span'} lineHeight={1}>
          {currentLocaleLabel}
        </Typography>
      </IconButton>
      <Menu
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={closeHandler}
      >
        {options.map(option => (
          <MenuItem key={option.locale} onClick={() => selectHandler(option.locale)}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default LanguageSwitch;

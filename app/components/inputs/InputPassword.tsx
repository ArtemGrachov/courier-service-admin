import { useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import OutlinedInput, { type OutlinedInputProps } from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import IconVisibility from '@mui/icons-material/Visibility';
import IconVisibilityOff from '@mui/icons-material/VisibilityOff';

const InputPassword: ComponentType<OutlinedInputProps> = (props) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const toggleHandler = () => {
    setShowPassword(!showPassword);
  }

  return (
    <OutlinedInput
      type={showPassword ? 'text' : 'password'}
      {...props}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            type="button"
            aria-label={showPassword ? t('input_password.hide_password') : t('input_password.show_password')}
            onClick={toggleHandler}
          >
            {showPassword ? <IconVisibilityOff /> : <IconVisibility />}
          </IconButton>
        </InputAdornment>
      }
    />
  )
}

export default InputPassword;

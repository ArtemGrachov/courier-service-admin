import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

const FormLogin: ComponentType = () => {
  const { t } = useTranslation();
  return (
    <Box
      component="form"
      gap={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <FormControl>
        <FormLabel htmlFor="login">
          {t('form_login.login')}
        </FormLabel>
        <TextField id="login" />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="password">
          {t('form_login.password')}
        </FormLabel>
        <TextField type="password" id="password" />
      </FormControl>
      <Button
        variant="contained"
        size="large"
        type="submit"
      >
        {t('form_login.submit')}
      </Button>
    </Box>
  )
}

export default FormLogin;

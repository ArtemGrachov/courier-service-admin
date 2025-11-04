import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const FormResetPassword: ComponentType = () => {
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
        <FormLabel htmlFor="new_password">
          {t('form_common.new_password')}
        </FormLabel>
        <TextField id="new_password" />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="repeat_password">
          {t('form_common.repeat_password')}
        </FormLabel>
        <TextField id="repeat_password" />
      </FormControl>
      <Button
        variant="contained"
        size="large"
        type="submit"
      >
        {t('form_common.submit')}
      </Button>
    </Box>
  )
}

export default FormResetPassword;

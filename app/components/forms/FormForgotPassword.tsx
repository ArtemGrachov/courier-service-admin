import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const FormForgotPassword: ComponentType = () => {
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
        <FormLabel htmlFor="email">
          {t('form_common.email')}
        </FormLabel>
        <TextField id="email" />
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

export default FormForgotPassword;

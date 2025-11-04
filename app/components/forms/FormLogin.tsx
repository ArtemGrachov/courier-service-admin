import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { EStatus } from '~/constants/status';

import { useErrorMessage } from '~/hooks/errors/use-error-message';
import InputPassword from '~/components/inputs/InputPassword';

import type { IFormLogin } from '~/types/forms/form-login';

interface IProps {
  submitStatus?: EStatus;
  submitError?: any;
  onSubmit?: (formValue: IFormLogin) => any;
}

const FormLogin: ComponentType<IProps> = ({ submitStatus, submitError, onSubmit }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm<IFormLogin>();

  const fieldLogin = register('login', {
    required: true,
  });
  const fieldPassword = register('password', {
    required: true,
  });

  const errorMessage = useErrorMessage(submitError);

  const submitHandler = async (formValue: IFormLogin) => {
    if (isProcessing) {
      return;
    }

    try {
      await (onSubmit && onSubmit(formValue));
      reset();
    } catch {}
  }

  const isProcessing = useMemo(() => submitStatus === EStatus.PROCESSING, [submitStatus]);
  const isError = useMemo(() => submitStatus === EStatus.ERROR, [submitStatus]);

  return (
    <Box
      component="form"
      gap={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
      onSubmit={handleSubmit(submitHandler)}
    >
      <FormControl>
        <FormLabel htmlFor="login">
          {t('form_login.login')}
        </FormLabel>
        <TextField
          id="login"
          {...fieldLogin}
          disabled={isProcessing}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="password">
          {t('form_common.password')}
        </FormLabel>
        <InputPassword
          id="password"
          {...fieldPassword}
          disabled={isProcessing}
        />
      </FormControl>
      <Button
        variant="contained"
        size="large"
        loading={isProcessing}
        type="submit"
      >
        {t('form_login.submit')}
      </Button>
      {isError && <Alert severity="error">
        {errorMessage}
      </Alert>}
    </Box>
  )
}

export default FormLogin;

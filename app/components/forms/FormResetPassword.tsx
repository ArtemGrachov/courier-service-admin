import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { EStatus } from '~/constants/status';

import { useErrorMessage } from '~/hooks/errors/use-error-message';
import InputPassword from '~/components/inputs/InputPassword';

import type { IFormResetPassword } from '~/types/forms/form-reset-password';

interface IProps {
  submitStatus?: EStatus;
  submitError?: any;
  onSubmit?: (formValue: IFormResetPassword) => any;
}

const FormResetPassword: ComponentType<IProps> = ({ submitStatus, submitError, onSubmit }) => {
  const { t } = useTranslation();
  const { register, reset, handleSubmit } = useForm<IFormResetPassword>();

  const fieldPassword = register('password', {
    required: true,
  });
  const fieldConfirmPassword = register('confirmPassword', {
    required: true,
  });

  const errorMessage = useErrorMessage(submitError);

  const submitHandler = async (formValue: IFormResetPassword) => {
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
        <FormLabel htmlFor="new_password">
          {t('form_common.new_password')}
        </FormLabel>
        <InputPassword
          id="new_password"
          {...fieldPassword}
          disabled={isProcessing}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="repeat_password">
          {t('form_common.repeat_password')}
        </FormLabel>
        <InputPassword
          id="repeat_password"
          {...fieldConfirmPassword}
          disabled={isProcessing}
        />
      </FormControl>
      <Button
        variant="contained"
        size="large"
        loading={isProcessing}
        type="submit"
      >
        {t('form_common.submit')}
      </Button>
      {isError && <Alert severity="error">
        {errorMessage}
      </Alert>}
    </Box>
  )
}

export default FormResetPassword;

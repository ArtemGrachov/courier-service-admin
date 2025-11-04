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
import { EMAIL_VALIDATOR } from '~/validators/email.validator';

import { useErrorMessage } from '~/hooks/errors/use-error-message';
import FieldClientErrors from '~/components/forms/FieldClientErrors';

import type { IFormForgotPassword } from '~/types/forms/form-forgot-password';

interface IProps {
  submitStatus?: EStatus;
  submitError?: any;
  onSubmit?: (formValue: IFormForgotPassword) => any;
}

const FormForgotPassword: ComponentType<IProps> = ({ submitStatus, submitError, onSubmit }) => {
  const { t } = useTranslation();
  const { formState, register, handleSubmit, reset } = useForm<IFormForgotPassword>({ mode: 'all' });
  const errors = formState.errors;

  const fieldEmail = register('email', {
    required: true,
    validate: {
      email: EMAIL_VALIDATOR
    }
  });

  const errorMessage = useErrorMessage(submitError);

  const submitHandler = async (formValue: IFormForgotPassword) => {
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
        <FormLabel
          htmlFor="email"
          error={!!errors.email}
        >
          {t('form_common.email')}
        </FormLabel>
        <TextField
          id="email"
          {...fieldEmail}
          error={!!errors.email}
          disabled={isProcessing}
        />
        <FieldClientErrors
          error={errors.email}
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

export default FormForgotPassword;

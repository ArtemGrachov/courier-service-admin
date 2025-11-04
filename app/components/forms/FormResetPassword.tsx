import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { EStatus } from '~/constants/status';
import { PASSWORD_MIN_LENGTH, PASSWORD_VALIDATOR } from '~/validators/password.validator';

import { useErrorMessage } from '~/hooks/errors/use-error-message';
import InputPassword from '~/components/inputs/InputPassword';
import FieldClientErrors from '~/components/forms/FieldClientErrors';

import type { IFormResetPassword } from '~/types/forms/form-reset-password';

interface IProps {
  submitStatus?: EStatus;
  submitError?: any;
  onSubmit?: (formValue: IFormResetPassword) => any;
}

const FormResetPassword: ComponentType<IProps> = ({ submitStatus, submitError, onSubmit }) => {
  const { t } = useTranslation();
  const { register, reset, handleSubmit, watch, formState } = useForm<IFormResetPassword>({ mode: 'onBlur' });
  const errors = formState.errors;

  const fieldPassword = register('password', PASSWORD_VALIDATOR);
  const fieldConfirmPassword = register('confirmPassword', {
    required: true,
    validate: {
      sameAs: (v: string) => v === watch('password'),
    },
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
        <FormLabel
          htmlFor="new_password"
          error={!!errors.password}
        >
          {t('form_common.new_password')}
        </FormLabel>
        <InputPassword
          id="new_password"
          {...fieldPassword}
          error={!!errors.password}
          disabled={isProcessing}
        />
        <FieldClientErrors
          error={errors.password}
          customMessages={{ minLength: t('common_validation.min_length', { minLength: PASSWORD_MIN_LENGTH }) }}
        />
      </FormControl>
      <FormControl>
        <FormLabel
          htmlFor="confirm_password"
          error={!!errors.confirmPassword}
        >
          {t('form_common.repeat_password')}
        </FormLabel>
        <InputPassword
          id="confirm_password"
          {...fieldConfirmPassword}
          error={!!errors.confirmPassword}
          disabled={isProcessing}
        />
        <FieldClientErrors
          error={errors.confirmPassword}
          customMessages={{ sameAs: t('common_validation.confirm_password') }}
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

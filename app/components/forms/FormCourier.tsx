import { useMemo, useRef, useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { EStatus } from '~/constants/status';
import { PASSWORD_MIN_LENGTH, PASSWORD_VALIDATOR } from '~/validators/password.validator';
import { EMAIL_VALIDATOR } from '~/validators/email.validator';

import { useErrorMessage } from '~/hooks/errors/use-error-message';
import InputPassword from '~/components/inputs/InputPassword';
import FieldClientErrors from '~/components/forms/FieldClientErrors';
import PasswordValidationHint from '~/components/forms/PasswordValidationHint';

import type { IFormCourier } from '~/types/forms/form-courier';
import { FormHelperText } from '@mui/material';

interface IProps {
  isEdit?: boolean;
  initialValue?: IFormCourier;
  submitStatus?: EStatus;
  submitError?: any;
  onSubmit?: (formValue: IFormCourier) => any;
}

const FormCourier: ComponentType<IProps> = ({ isEdit, initialValue, submitStatus, submitError, onSubmit }) => {
  const { t } = useTranslation();
  const { formState, register, handleSubmit, reset, watch } = useForm<IFormCourier>({
    mode: 'all',
    criteriaMode: 'all',
    defaultValues: initialValue,
  });
  const errors = formState.errors;

  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const passwordRef = useRef(null);
  const passwordValue = watch('password');

  const fieldName = register('name', {
    required: true,
  });
  const fieldEmail = register('email', {
    required: true,
    validate: {
      email: EMAIL_VALIDATOR
    }
  });
  const fieldPhoneNumber = register('phoneNumber', {
    required: true,
  });
  const fieldPassword = register('password', {
    ...PASSWORD_VALIDATOR,
    required: false,
  });

  const errorMessage = useErrorMessage(submitError);

  const submitHandler = async (formValue: IFormCourier) => {
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
          htmlFor="name"
          required={true}
          error={!!errors.name}
        >
          {t('form_common.name')}
        </FormLabel>
        <TextField
          id="name"
          {...fieldName}
          error={!!errors.name}
          disabled={isProcessing}
        />
        <FieldClientErrors
          error={errors.name}
        />
      </FormControl>
      <FormControl>
        <FormLabel
          htmlFor="phone"
          required
          error={!!errors.phoneNumber}
        >
          {t('form_common.phone')}
        </FormLabel>
        <TextField
          id="phone"
          {...fieldPhoneNumber}
          error={!!errors.phoneNumber}
          disabled={isProcessing}
        />
        <FieldClientErrors
          error={errors.phoneNumber}
        />
      </FormControl>
      <FormControl>
        <FormLabel
          htmlFor="email"
          required
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
      <FormControl>
        <FormLabel
          htmlFor="password"
          error={!!errors.password}
        >
          {t('form_common.password')}
        </FormLabel>
        <InputPassword
          id="password"
          {...fieldPassword}
          ref={el => {
            fieldPassword.ref(el);
            passwordRef.current = el as any;
          }}
          error={!!errors.password}
          disabled={isProcessing}
          onFocus={() => setIsPasswordFocus(true)}
          onBlur={e => {setIsPasswordFocus(false); fieldPassword.onBlur(e)}}
        />
        <FormHelperText>
          {t('form_courier.password_hint')}
        </FormHelperText>
        <PasswordValidationHint
          ref={passwordRef}
          value={passwordValue}
          open={isPasswordFocus}
          error={errors.password}
        />
        <FieldClientErrors
          error={errors.password}
          customMessages={{ minLength: t('common_validation.min_length', { minLength: PASSWORD_MIN_LENGTH }) }}
        />
      </FormControl>
      <Button
        variant="contained"
        color="success"
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

export default FormCourier;

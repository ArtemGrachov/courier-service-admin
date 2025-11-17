import { useMemo, useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

import i18n from '~/i18n/config';

import { EStatus } from '~/constants/status';

import { ForgotPasswordProvider, useForgotPasswordCtx } from './providers/forgot-password';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import AuthLinks from '~/components/auth/AuthLinks';
import FormForgotPassword from '~/components/forms/FormForgotPassword';

import type { IFormForgotPassword } from '~/types/forms/form-forgot-password';

const ViewForgotPassword: ComponentType = observer(() => {
  const { t } = useTranslation();
  const { store, submit } = useForgotPasswordCtx();
  const [email, setEmail] = useState<string | null>(null);
  const errorSnackbar = useErrorSnackbar();

  const submitHandler = async (formValue: IFormForgotPassword) => {
    try {
      await submit(formValue);
      setEmail(formValue.email);
    } catch (err) {
      errorSnackbar(err);
      throw err;
    }
  }

  const isSuccess = useMemo(() => store.submitStatus === EStatus.SUCCESS, [store.submitStatus])

  return (
    <Card sx={{ width: '100%', maxWidth: 340 }}>
      <CardContent>
        <Typography component="h1" variant="h4" marginBottom={2}>
          {t('view_forgot_password.title')}
        </Typography>
        <FormForgotPassword
          submitStatus={store.submitStatus}
          submitError={store.submitError}
          onSubmit={submitHandler}
        />
        {isSuccess && <Alert sx={{ marginTop: 2, marginBottom: 2 }}>
          {t('view_forgot_password.success_hint', { email })}
        </Alert>}
        <AuthLinks isResetPassword={true} />
      </CardContent>
    </Card>
  )
})

const Wrapper = () => {
  return (
    <ForgotPasswordProvider>
      <ViewForgotPassword />
    </ForgotPasswordProvider>
  )
}

export default Wrapper;

export function meta() {
  const { t } = i18n;

  return [
    { title: t('common_meta.title_template', { title: t('view_forgot_password.title') }) },
  ];
}


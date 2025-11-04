import { lazy, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { LoginProvider, useLoginCtx } from './providers/login';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';

import AuthLinks from '~/components/auth/AuthLinks';
import FormLogin from '~/components/forms/FormLogin';

import type { IFormLogin } from '~/types/forms/form-login';

const ModalAlert = lazy(() => import('~/components/modals/ModalAlert'));

const ViewLogin: ComponentType = observer(() => {
  const { t } = useTranslation();
  const { store, submit } = useLoginCtx();
  const errorSnackbar = useErrorSnackbar();

  const submitHandler = async (formValue: IFormLogin) => {
    try {
      await submit(formValue);
    } catch (err) {
      errorSnackbar(err);
      throw err;
    }
  }

  return (
    <Card sx={{ width: '100%', maxWidth: 340 }}>
      <CardContent>
        <Typography component="h1" variant="h4" marginBottom={2}>
          {t('view_login.title')}
        </Typography>
        <FormLogin
          submitStatus={store.submitStatus}
          submitError={store.submitError}
          onSubmit={submitHandler}
        />
        <AuthLinks isLogin={true} />
      </CardContent>
    </Card>
  )
});

const Wrapper = () => {
  return (
    <LoginProvider>
      <ViewLogin />
    </LoginProvider>
  )
}

export default Wrapper;

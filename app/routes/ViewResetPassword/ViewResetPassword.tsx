import { useMemo, type ComponentType } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router';
import { observer } from 'mobx-react-lite';

import { EStatus } from '~/constants/status';
import { ROUTES } from '~/router/routes';

import { ResetPasswordProvider, useResetPasswordCtx } from './providers/reset-password';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import { useRoutePath } from '~/hooks/routing/use-route-path';
import AuthLinks from '~/components/auth/AuthLinks';
import FormResetPassword from '~/components/forms/FormResetPassword';

import type { IFormResetPassword } from '~/types/forms/form-reset-password';

const ViewResetPassword: ComponentType = observer(() => {
  const { t } = useTranslation();
  const { store, submit } = useResetPasswordCtx();
  const errorSnackbar = useErrorSnackbar();
  const routePath = useRoutePath();

  const submitHandler = async (formValue: IFormResetPassword) => {
    try {
      await submit(formValue);
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
          {t('view_reset_password.title')}
        </Typography>
        <FormResetPassword
          submitStatus={store.submitStatus}
          submitError={store.submitError}
          onSubmit={submitHandler}
        />
        {isSuccess && <Alert sx={{ marginTop: 2, marginBottom: 2 }}>
          <Trans
            i18nKey="view_reset_password.success_hint"
            components={{ 
              Link: <Link to={routePath(ROUTES.LOGIN)} component={RouterLink} />
            }}
          />
        </Alert>}
        <AuthLinks isResetPassword={true} />
      </CardContent>
    </Card>
  )
});

const Wrapper = () => {
  return (
    <ResetPasswordProvider>
      <ViewResetPassword />
    </ResetPasswordProvider>
  )
}

export default Wrapper;

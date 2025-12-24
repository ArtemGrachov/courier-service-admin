import { useMemo, type ComponentType } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router';

import i18n from '~/i18n/config';

import { EStatus } from '~/constants/status';
import { ROUTES } from '~/router/routes';

import { ChangePasswordProvider, useChangePasswordCtx } from './providers/change-password';
import { useTitlePortalCtx } from '~/providers/title-portal';

import { useErrorSnackbar } from '~/hooks/other/use-error-snackbar';
import { useRoutePath } from '~/hooks/routing/use-route-path';
import FormResetPassword from '~/components/forms/FormResetPassword';

import type { IFormResetPassword } from '~/types/forms/form-reset-password';

const ViewChangePassword: ComponentType = observer(() => {
  const { t } = useTranslation();
  const { store, submit } = useChangePasswordCtx();
  const errorSnackbar = useErrorSnackbar();
  const routePath = useRoutePath();
  const { token } = useParams();
  const titlePortalRef = useTitlePortalCtx();

  const submitHandler = async (formValue: IFormResetPassword) => {
    try {
      await submit(token! ,formValue);
    } catch (err) {
      errorSnackbar(err);
      throw err;
    }
  }

  const isSuccess = useMemo(() => store.submitStatus === EStatus.SUCCESS, [store.submitStatus])

  return (
    <Box padding={3}>
      <Portal container={() => titlePortalRef?.current ?? null}>
        {t('view_change_password.title')}
      </Portal>
      <Box maxWidth={500} margin="auto">
        <FormResetPassword
          submitStatus={store.submitStatus}
          submitError={store.submitError}
          onSubmit={submitHandler}
        />
        {isSuccess && <Alert sx={{ marginTop: 2, marginBottom: 2 }}>
          <Trans
            i18nKey="view_change_password.success_hint"
            components={{ 
              Link: <Link to={routePath(ROUTES.LOGIN)} component={RouterLink} />
            }}
          />
        </Alert>}
      </Box>
    </Box>
  )
});

const Wrapper = () => {
  return (
    <ChangePasswordProvider>
      <ViewChangePassword />
    </ChangePasswordProvider>
  )
}

export default Wrapper;

export function meta() {
  const { t } = i18n;

  return [
    { title: t('common_meta.title_template', { title: t('view_change_password.title') }) },
  ];
}


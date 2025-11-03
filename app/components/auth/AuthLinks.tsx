import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router';

import { ROUTES } from '~/router/routes';

interface IProps {
  isLogin?: boolean;
  isResetPassword?: boolean;
}

const AuthLinks: ComponentType<IProps> = ({ isLogin, isResetPassword }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        flexDirection: 'column',
        gap: 2,
        marginTop: 2,
      }}
    >
      {!isLogin && <Link to={ROUTES.LOGIN} component={RouterLink}>
        {t('auth_links.login_link')}
      </Link>}
      {!isResetPassword && <Link to={ROUTES.FORGOT_PASSWORD} component={RouterLink}>
        {t('auth_links.forgot_password_link')}
      </Link>}
    </Box>
  )
}

export default AuthLinks;

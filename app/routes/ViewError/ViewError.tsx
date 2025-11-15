import { useEffect, useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteError, Link as RouterLink } from 'react-router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { ROUTES } from '~/router/routes';

import { useAuthCtx } from '~/providers/auth/hooks/use-auth-ctx';

import { useErrorMessage } from '~/hooks/errors/use-error-message';
import { useRoutePath } from '~/hooks/routing/use-route-path';

const ViewError: ComponentType = () => {
  const { t } = useTranslation();
  const routeError = useRouteError() as any;
  const isNotFound = routeError?.status === 404;
  const [isMounted, setIsMounted] = useState(false);
  const routePath = useRoutePath();
  const { store: authStore } = useAuthCtx();

  const errorMessage = useErrorMessage(routeError, false);
  const title = isNotFound ? t('view_error.title_not_found') : t('view_error.title_generic');
  const subtitle = isNotFound ? t('view_error.subtitle_not_found') : (errorMessage || t('view_error.subtitle_generic'));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Box textAlign="center">
        <h1>
          {title}
        </h1>
        <p>
          {subtitle}
        </p>
        <Button
          component={RouterLink}
          to={authStore.isAuthorized ? routePath(ROUTES.HOME) : routePath(ROUTES.LOGIN)}
          variant="contained"
          color="success"
        >
          {t('view_error.return')}
        </Button>
      </Box>
    </Box>
  )
}

export default ViewError;


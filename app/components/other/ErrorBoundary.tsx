import { useEffect, type ComponentType } from 'react';
import { useRouteError } from 'react-router';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import { useTranslation } from 'react-i18next';

import { useTitlePortalCtx } from '~/providers/title-portal';

import PageError from '~/components/other/PageError';

const ErrorBoundary: ComponentType = () => {
  const error = useRouteError();
  const titlePortalRef = useTitlePortalCtx();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(error);
  }, []);

  return (
    <>
      <Portal container={() => titlePortalRef?.current ?? null}>
        {t('common_errors.page_title')}
      </Portal>
      <Box
        padding={3}
        width="100%"
        height="100%"
        boxSizing="border-box"
      >
        <PageError error={error} />
      </Box>
    </>
  )
}

export default ErrorBoundary;


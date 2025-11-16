import { lazy, useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import { ROUTES } from '~/router/routes';

import { useRoutePath } from '~/hooks/routing/use-route-path';

const ContentEN = lazy(() => import('./content/ContentEN'));
const ContentUA = lazy(() => import('./content/ContentUA'));

const ViewAbout: ComponentType = () => {
  const { t, i18n } = useTranslation();
  const routePath = useRoutePath();

  const ContentEl = useMemo(() => {
    switch (i18n.language) {
      case 'en': {
        return ContentEN;
      }
      case 'uk': {
        return ContentUA;
      }
      default: {
        return null;
      }
    }
  }, [i18n.language]);

  return (
    <Container>
      {ContentEl && <ContentEl />}
      <Button
        sx={{ mt: 4 }}
        component={RouterLink}
        to={routePath(ROUTES.HOME)}
        variant="contained"
        color="success"
      >
        {t('view_about.main_link')}
      </Button>
    </Container>
  )
}

export default ViewAbout;


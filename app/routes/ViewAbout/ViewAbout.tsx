import { lazy, useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';

import Header from '~/layouts/default/components/Header';

const ContentEN = lazy(() => import('./content/ContentEN'));
const ContentUA = lazy(() => import('./content/ContentUA'));

const ViewAbout: ComponentType = () => {
  const { i18n } = useTranslation();

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
    </Container>
  )
}

export default ViewAbout;


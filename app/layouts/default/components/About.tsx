import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import AssignmentIcon from '@mui/icons-material/Assignment';

import { ROUTES } from '~/router/routes';

import NavList from '~/components/navigation/NavList';
import type { INavItem } from '~/components/navigation/NavItem';

const About: ComponentType = () => {
  const { t, i18n } = useTranslation();

  const about: INavItem = useMemo(() => {
    return {
      label: t('nav.about'),
      icon: <AssignmentIcon />,
      path: ROUTES.ABOUT,
    }
  }, [i18n.language])

  return (
    <NavList items={[about]} />
  )
}

export default About;

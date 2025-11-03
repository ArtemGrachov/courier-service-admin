import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import LogoutIcon from '@mui/icons-material/Logout';

import NavList from '~/components/navigation/NavList';
import type { INavItem } from '~/components/navigation/NavItem';

const Logout: ComponentType = () => {
  const { t, i18n } = useTranslation();

  const logout: INavItem = useMemo(() => {
    return {
      label: t('nav.logout'),
      icon: <LogoutIcon />,
    }
  }, [i18n.language])

  return (
    <NavList items={[logout]} />
  )
}

export default Logout;

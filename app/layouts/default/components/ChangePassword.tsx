import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import KeyIcon from '@mui/icons-material/Key';

import { ROUTES } from '~/router/routes';

import NavList from '~/components/navigation/NavList';
import type { INavItem } from '~/components/navigation/NavItem';

const ChangePassword: ComponentType = () => {
  const { t, i18n } = useTranslation();

  const changePassword: INavItem = useMemo(() => {
    return {
      label: t('nav.change_password'),
      icon: <KeyIcon />,
      path: ROUTES.CHANGE_PASSWORD,
    }
  }, [i18n.language])

  return (
    <NavList items={[changePassword]} />
  )
}

export default ChangePassword;

import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';

import MapIcon from '@mui/icons-material/Map';
import WorkIcon from '@mui/icons-material/Work';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { ROUTES } from '~/router/routes';
import NavList from '~/components/navigation/NavList';

const NAV_ITEMS = [
  {
    key: 'map',
    icon: <MapIcon />,
    translation: 'nav.map',
    path: ROUTES.MAP,
  },
  {
    key: 'couriers',
    icon: <WorkIcon />,
    translation: 'nav.couriers',
    path: ROUTES.COURIERS,
  },
  {
    key: 'orders',
    icon: <ChecklistIcon />,
    translation: 'nav.orders',
    path: ROUTES.ORDERS,
  },
  {
    key: 'clients',
    icon: <AccountCircleIcon />,
    translation: 'nav.clients',
    path: ROUTES.CLIENTS,
  },
];

const Navigation: ComponentType = () => {
  const { t, i18n } = useTranslation();

  const outputItems = useMemo(() => {
    return NAV_ITEMS.map(item => {
      return {
        ...item,
        label: t(item.translation),
      };
    })
  }, [i18n.language]);

  return (
    <NavList items={outputItems} />
  )
}

export default Navigation;

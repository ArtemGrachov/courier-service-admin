import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import type { SxProps } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MapIcon from '@mui/icons-material/Map';
import WorkIcon from '@mui/icons-material/Work';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

import { ROUTES } from '~/router/routes';

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
    <List>
      {outputItems.map(item => (
        <ListItem key={item.key}>
          <ListItemButton component={Link} to={item.path}>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

export default Navigation;

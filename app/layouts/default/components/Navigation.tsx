import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';

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

const NAV_ITEMS = [
  {
    key: 'map',
    icon: <MapIcon />,
    translation: 'nav.map',
  },
  {
    key: 'couriers',
    icon: <WorkIcon />,
    translation: 'nav.couriers',
  },
  {
    key: 'orders',
    icon: <ChecklistIcon />,
    translation: 'nav.orders',
  },
  {
    key: 'clients',
    icon: <AccountCircleIcon />,
    translation: 'nav.clients',
  },
  {
    key: 'logout',
    icon: <LogoutIcon />,
    translation: 'nav.logout',
    style: { marginTop: 'auto' } as SxProps,
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
    <List sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {outputItems.map(item => (
        <ListItem key={item.key} sx={item.style}>
          <ListItemButton>
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

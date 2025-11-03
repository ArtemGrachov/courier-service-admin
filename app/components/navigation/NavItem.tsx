import type { ComponentType, MouseEventHandler, ReactNode } from 'react';
import { Link, type To } from 'react-router';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export interface INavItem {
  key?: string | number;
  path?: To;
  icon?: ReactNode;
  label?: ReactNode;
  onClick?: (item: INavItem) => any;
}

interface IProps {
  item: INavItem;
}

const NavItem: ComponentType<IProps> = ({ item }) => {
  return (
    <ListItem>
      <ListItemButton
        component={item.path ? Link : 'button'}
        to={item.path}
        onClick={item.onClick ? (() => item.onClick!(item)) : undefined}
      >
        <ListItemIcon>
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.label} />
      </ListItemButton>
    </ListItem>
  )
}

export default NavItem;

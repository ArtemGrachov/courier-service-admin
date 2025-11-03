import type { ComponentType } from 'react';
import List from '@mui/material/List';

import type { INavItem } from '~/components/navigation/NavItem';
import NavItem from '~/components/navigation/NavItem';

interface IProps {
  items?: INavItem[];
}

const NavList: ComponentType<IProps> = ({ items }) => {
  return (
    <List>
      {items?.map((item, index) => <NavItem key={item.key ?? index} item={item} />)}
    </List>
  )
}

export default NavList;

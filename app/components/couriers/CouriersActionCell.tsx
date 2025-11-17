import { memo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';

import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';

import { ROUTE_PATHS } from '~/router/routes';

import { useRoutePath } from '~/hooks/routing/use-route-path';

import type { ICourier } from '~/types/models/courier';

interface IProps {
  params: any;
}

const CouriersActionCell: ComponentType<IProps> = memo(({ params }) => {
  const { t } = useTranslation();
  const courier = params.row as ICourier;
  const routePath = useRoutePath();

  return (
    <>
      <IconButton
        component={RouterLink}
        to={routePath(ROUTE_PATHS.COURIER_EDIT, { courierId: courier.id })}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        component={RouterLink}
        to={routePath(ROUTE_PATHS.COURIER, { courierId: courier.id })}
        aria-label={t('couriers_table.details')}
      >
        <RemoveRedEyeIcon />
      </IconButton>
    </>
  )
})

export default CouriersActionCell;


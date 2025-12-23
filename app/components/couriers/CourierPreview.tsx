import { type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { ROUTES } from '~/router/routes';

import { useRoutePath } from '~/hooks/routing/use-route-path';
import Rating from '~/components/other/Rating';
import CourierStatus from '~/components/couriers/CourierStatus';

import type { ICourier } from '~/types/models/courier';

export interface IProps {
  courier: ICourier;
}

const CourierPreview: ComponentType<IProps> = ({ courier }) => {
  const { t } = useTranslation();
  const routePath = useRoutePath();
  const { id, name, rating, status, active_orders_count, phone, email } = courier;

  return (
    <Stack gap={2}>
      <Stack direction="row" gap={2} justifyContent="space-between">
        <Box gap={1}>
          <Typography variant="subtitle1" component="div">
            {t('courier_card.id')} #{id}
          </Typography>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
        </Box>
        <Box gap={1}>
          <Typography variant="caption" component="div">
            {t('courier_card.rating')}
          </Typography>
          <Rating rating={rating} />
        </Box>
      </Stack>
      <Stack direction="row" gap={2} justifyContent="space-between">
        <Box gap={1}>
          <Typography variant="caption" component="div" color="warning">
            {t('courier_card.current_orders_count')}
          </Typography>
          <Typography variant="h5" component="div" color="warning">
            {active_orders_count}
          </Typography>
        </Box>
        <Box gap={1}>
          <CourierStatus status={status} />
        </Box>
      </Stack>
      <Stack direction="row" gap={2} justifyContent="space-between" alignItems="flex-end">
        <Stack gap={2}>
          {phone && <Box>
            <Link
              component="a"
              href={`tel:${phone}`}
              target="_blank"
            >
              {phone}
            </Link>
          </Box>}
          {email && <Box>
            <Link
              component="a"
              href={`mailto:${email}`}
              target="_blank"
            >
              {email}
            </Link>
          </Box>}
        </Stack>
        <Box>
          <Link
            to={routePath(ROUTES.COURIER, { courierId: id })}
            component={RouterLink}
          >
            {t('courier_card.link')}
          </Link>
        </Box>
      </Stack>
    </Stack>
  )
}

export default CourierPreview;

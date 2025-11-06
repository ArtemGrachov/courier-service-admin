import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { ROUTES } from '~/router/routes';

import { useRoutePath } from '~/hooks/routing/use-route-path';
import Rating from '~/components/other/Rating';
import CourierStatus from '~/components/couriers/CourierStatus';

import type { ICourier } from '~/types/models/courier';

interface IProps {
  courier: ICourier;
}

const CourierCard: ComponentType<IProps> = ({ courier }) => {
  const { t } = useTranslation();
  const routePath = useRoutePath();

  return (
    <Card>
      <CardContent>
        <Stack gap={2}>
          <Stack direction="row" gap={2} justifyContent="space-between">
            <Box gap={1}>
              <Typography variant="subtitle1" component="div">
                {t('courier_card.id')} #{courier.id}
              </Typography>
              <Typography variant="h5" component="div">
                {courier.name}
              </Typography>
            </Box>
            <Box gap={1}>
              <Typography variant="caption" component="div">
                {t('courier_card.rating')}
              </Typography>
              <Rating rating={courier.rating} />
            </Box>
          </Stack>
          <Stack direction="row" gap={2} justifyContent="space-between">
            <Box gap={1}>
              <Typography variant="caption" component="div" color="warning">
                {t('courier_card.current_orders_count')}
              </Typography>
              <Typography variant="h5" component="div" color="warning">
                {courier.currentOrdersCount}
              </Typography>
            </Box>
            <Box gap={1}>
              <CourierStatus status={courier.status} />
            </Box>
          </Stack>
          <Box>
            <Link
              to={routePath(ROUTES.COURIER, { courierId: courier.id })}
              component={RouterLink}
            >
              {t('courier_card.link')}
            </Link>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default CourierCard;

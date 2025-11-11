import { type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

import { ROUTE_PATHS } from '~/router/routes';

import { useRoutePath } from '~/hooks/routing/use-route-path';

import Rating from '~/components/other/Rating';
import CourierStatus from '~/components/couriers/CourierStatus';

import type { ICourier } from '~/types/models/courier';

interface IProps {
  courier: ICourier;
}

const CourierDetails: ComponentType<IProps> = ({ courier }) => {
  const { phoneNumber, email } = courier;
  const { t } = useTranslation();
  const routePath = useRoutePath();

  return (
    <Card>
      <CardContent>
        <Stack gap={2}>
          <Grid container spacing={2}>
            <Grid size={6} gap={2}>
              <Box gap={1} display="flex" flexDirection="row" alignItems="center">
                <IconButton
                  component={RouterLink}
                  to={routePath(ROUTE_PATHS.COURIER_EDIT, { courierId: courier.id })}
                >
                  <EditIcon />
                </IconButton>
                <Box gap={1}>
                  <Typography variant="subtitle1" component="div">
                    {t('courier_details.id')} #{courier.id}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {courier.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={6} gap={2}>
              <Stack direction="row" gap={2} justifyContent="space-between">
                <Box gap={1}>
                  <Typography variant="subtitle1" component="div">
                    {t('courier_details.rating')}
                  </Typography>
                  <Rating rating={courier.rating} />
                </Box>
                <Box gap={1}>
                  <Typography variant="subtitle1" component="div">
                    {t('courier_details.status')}
                  </Typography>
                  <CourierStatus status={courier.status} />
                </Box>
              </Stack>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={6} gap={2}>
              <Box gap={1}>
                <Typography variant="subtitle1" component="div">
                  {t('courier_details.phone')}
                </Typography>
                {phoneNumber ? (<Link
                  component="a"
                  href={`tel:${phoneNumber}`}
                  target="_blank"
                >
                  {phoneNumber}
                </Link>) : '-'}
              </Box>
            </Grid>
            <Grid size={6} gap={2}>
              <Box gap={1}>
                <Typography variant="subtitle1" component="div">
                  {t('courier_details.email')}
                </Typography>
                {email ? (<Link
                  component="a"
                  href={`mailto:${email}`}
                  target="_blank"
                >
                  {email}
                </Link>) : '-'}
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={6} gap={2}>
              <Box gap={1}>
                <Typography variant="subtitle1" component="div" color="warning">
                  {t('courier_details.current_orders_count')}
                </Typography>
                <Typography variant="h5" component="div" color="warning">
                  {courier.currentOrdersCount}
                </Typography>
              </Box>
            </Grid>
            <Grid size={6} gap={2}>
              <Box gap={1}>
                <Typography variant="subtitle1" component="div">
                  {t('courier_details.total_orders_count')}
                </Typography>
                <Typography variant="h5" component="div">
                  {courier.totalOrdersCount}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default CourierDetails;

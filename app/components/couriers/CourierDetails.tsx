import { type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Link } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import Rating from '~/components/other/Rating';

import type { ICourier } from '~/types/models/courier';

interface IProps {
  courier: ICourier;
}

const CourierDetails: ComponentType<IProps> = ({ courier }) => {
  const { phoneNumber, email } = courier;
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Stack gap={2}>
          <Grid container spacing={2}>
            <Grid size={6} gap={2}>
              <Box gap={1}>
                <Typography variant="subtitle1" component="div">
                  {t('courier_details.id')} #{courier.id}
                </Typography>
                <Typography variant="h5" component="div">
                  {courier.name}
                </Typography>
              </Box>
            </Grid>
            <Grid size={6} gap={2}>
              <Box gap={1}>
                <Typography variant="subtitle1" component="div">
                  {t('courier_details.rating')}
                </Typography>
                <Rating rating={courier.rating} />
              </Box>
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

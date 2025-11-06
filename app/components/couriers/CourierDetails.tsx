import { type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@mui/material';
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
        <Stack direction="row" gap={2} justifyContent="space-between">
          <Box gap={1}>
            <Typography variant="subtitle1" component="div">
              {t('courier_details.id')} #{courier.id}
            </Typography>
            <Typography variant="h5" component="div">
              {courier.name}
            </Typography>
          </Box>
          <Box gap={1}>
            <Typography variant="subtitle1" component="div">
              {t('courier_details.rating')}
            </Typography>
            <Rating rating={courier.rating} />
          </Box>
          <Box gap={1}>
            <Typography variant="subtitle1" component="div" color="warning">
              {t('courier_details.current_orders_count')}
            </Typography>
            <Typography variant="h5" component="div" color="warning">
              {courier.currentOrdersCount}
            </Typography>
          </Box>
          <Box gap={1}>
            <Typography variant="subtitle1" component="div">
              {t('courier_details.total_orders_count')}
            </Typography>
            <Typography variant="h5" component="div">
              {courier.totalOrdersCount}
            </Typography>
          </Box>
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
        </Stack>
      </CardContent>
    </Card>
  )
}

export default CourierDetails;

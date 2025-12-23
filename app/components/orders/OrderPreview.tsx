import { useMemo, type ComponentType } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { DATE_TIME_FORMAT } from '~/constants/datetime';

import OrderStatus from '~/components/orders/OrderStatus';

import type { IOrder } from '~/types/models/order';

export interface IProps {
  order: IOrder;
}

const OrderPreview: ComponentType<IProps> = ({ order }) => {
  const { t } = useTranslation();

  const orderedDateFormatted = useMemo(() => {
    return order.ordered_at ? dayjs(order.ordered_at).format(DATE_TIME_FORMAT) : '-';
  }, [order]);

  const closedDateFormatted = useMemo(() => {
    return order.completed_at ? dayjs(order.completed_at).format(DATE_TIME_FORMAT) : '-';
  }, [order]);

  return (
    <Stack gap={2}>
      <Stack gap={2} direction="row" justifyContent="space-between">
        <Typography variant="subtitle1" component="div">
          {t('order_card.id')} #{order.id}
        </Typography>
        <OrderStatus status={order.status} />
      </Stack>
      <Typography variant="subtitle1" component="div">
        {order.description}
      </Typography>
      <Stack gap={2} direction="row" justifyContent="space-between">
        <Box gap={1}>
          <Typography variant="caption" component="div">
            {t('order_card.ordered_at')}
          </Typography>
          <Typography variant="body1" component="div">
            {orderedDateFormatted}
          </Typography>
        </Box>
        <Box gap={1}>
          <Typography variant="caption" component="div">
            {t('order_card.closed_at')}
          </Typography>
          <Typography variant="body1" component="div">
            {closedDateFormatted}
          </Typography>
        </Box>
      </Stack>
      <Stack gap={2}>
        <Stack gap={2} direction="row" justifyContent="space-between">
          <Typography variant="caption" component="div">
            {t('order_card.weight')}
          </Typography>
          <Typography variant="body1" component="div">
            {order.weight ?? '-'}
          </Typography>
        </Stack>
        <Stack gap={2} direction="row" justifyContent="space-between">
          <Typography variant="caption" component="div">
            {t('order_card.size')}
          </Typography>
          <Typography variant="body1" component="div">
            {order.size ?? '-'}
          </Typography>
        </Stack>
        <Stack gap={2} direction="row" justifyContent="space-between">
          <Typography variant="caption" component="div">
            {t('order_card.volume')}
          </Typography>
          <Typography variant="body1" component="div">
            {order.volume ?? '-'}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default OrderPreview;

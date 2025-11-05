import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import Chip from '@mui/material/Chip';

import { EOrderStatus } from '~/constants/order';

interface IProps {
  status: EOrderStatus;
}

const OrderStatus: ComponentType<IProps> = ({ status }) => {
  const { t } = useTranslation();

  const color = useMemo(() => {
    switch (status) {
      case EOrderStatus.COMPLETED: {
        return 'success';
      }
      case EOrderStatus.CANCELLED: {
        return 'default';
      }
      case EOrderStatus.PROCESSING: {
        return 'secondary';
      }
      case EOrderStatus.RECEIVED: {
        return 'primary';
      }
    }
  }, [status]);

  return (
    <Chip label={t(`order_status.${status}`)} color={color} />
  )
}

export default OrderStatus;

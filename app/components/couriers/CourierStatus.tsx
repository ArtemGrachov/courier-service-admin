import { useMemo, type ComponentType } from 'react';
import Chip from '@mui/material/Chip';

import { ECourierStatus } from '~/constants/couriers';
import { useTranslation } from 'react-i18next';

interface IProps {
  status: ECourierStatus;
}

const CourierStatus: ComponentType<IProps> = ({ status }) => {
  const { t } = useTranslation();

  const color = useMemo(() => {
    switch (status) {
      case ECourierStatus.DELIVERING: {
        return 'success';
      }
      case ECourierStatus.IDLE: {
        return 'warning';
      }
      case ECourierStatus.OFFLINE: {
        return 'default';
      }
      case ECourierStatus.BLOCKED: {
        return 'error';
      }
    }
  }, [status]);

  return (
    <Chip label={t(`courier_status.${status}`)} color={color} />
  )
}

export default CourierStatus;

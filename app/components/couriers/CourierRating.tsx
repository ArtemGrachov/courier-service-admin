import { useMemo, type ComponentType } from 'react';
import Chip from '@mui/material/Chip';

interface IProps {
  rating: number;
}

const CourierRating: ComponentType<IProps> = ({ rating }) => {
  const color = useMemo(() => {
    if (rating <= 2) {
      return 'error';
    } else if (rating <= 3) {
      return 'warning';
    } else if (rating <= 4) {
      return 'info';
    } else {
      return 'success';
    }
  }, [rating]);

  return (
    <Chip label={rating} color={color} />
  )
}

export default CourierRating;

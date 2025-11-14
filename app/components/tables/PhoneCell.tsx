import { memo, type ComponentType } from 'react';
import Link from '@mui/material/Link';

interface IProps {
  params: any;
}

const PhoneCell: ComponentType<IProps> = memo(({ params }) => {
  return params.value ? (
    <Link
      component="a"
      href={`tel:${params.value}`}
    >
      {params.value}
    </Link>
  ) : '-';
});

export default PhoneCell;


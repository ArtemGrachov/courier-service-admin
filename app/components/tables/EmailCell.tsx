import { memo, type ComponentType } from 'react';
import Link from '@mui/material/Link';

interface IProps {
  params: any;
}

const EmailCell: ComponentType<IProps> = memo(({ params }) => {
  return params.value ? (
    <Link
      component="a"
      href={`mailto:${params.value}`}
      target="_blank"
    >
      {params.value}
    </Link>
  ) : '-';
});

export default EmailCell;


import { type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { useRoutePath } from '~/hooks/routing/use-route-path';

import CourierPreview, { type IProps } from '~/components/couriers/CourierPreview';

const CourierCard: ComponentType<IProps> = (props) => {
  return (
    <Card>
      <CardContent>
        <CourierPreview {...props} />
      </CardContent>
    </Card>
  )
}

export default CourierCard;

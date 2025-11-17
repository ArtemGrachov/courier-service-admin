import { type ComponentType } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import OrderPreview, { type IProps } from '~/components/orders/OrderPreview';

const OrderCard: ComponentType<IProps> = (props) => {
  return (
    <Card>
      <CardContent>
        <OrderPreview {...props} />
      </CardContent>
    </Card>
  )
}

export default OrderCard;

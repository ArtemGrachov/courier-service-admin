import { type ComponentType } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';

import OrdersTable from '~/components/orders/OrdersTable';

import type { IOrder } from '~/types/models/order';

import orders from '~/mock-data/orders.json';

const ViewOrders: ComponentType = observer(() => {
  return (
    <Box
      flexDirection="column"
      display="flex"
      gap={2}
      padding={3}
      width="100%"
      boxSizing="border-box"
    >
      <OrdersTable
        items={orders as IOrder[]}
      />
    </Box>
  )
})

export default ViewOrders;

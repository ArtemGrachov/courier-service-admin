import type { ComponentType } from 'react';
import { Box } from '@mui/material';

import CouriersTable from '~/components/couriers/CouriersTable';

const ViewCouriers: ComponentType = () => {
  return (
    <Box
      flexDirection="column"
      gap={2}
      padding={3}
      width="100%"
    >
      <CouriersTable />
    </Box>
  )
}

export default ViewCouriers;

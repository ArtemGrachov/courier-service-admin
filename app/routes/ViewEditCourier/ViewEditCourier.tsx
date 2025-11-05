import Box from '@mui/material/Box';
import type { ComponentType } from 'react';
import FormCourier from '~/components/forms/FormCourier';

const ViewEditCourier: ComponentType = () => {
  return (
    <Box padding={3}>
      <Box maxWidth={500} margin="auto">
        <FormCourier />
      </Box>
    </Box>
  )
}

export default ViewEditCourier;

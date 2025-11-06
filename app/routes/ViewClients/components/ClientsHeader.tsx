import type { ComponentType } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';

const ClientsHeader: ComponentType = () => {
  return (
    <Stack direction="row" justifyContent="space-between" gap={4}>
      <Stack direction="row" gap={2}>
        <IconButton color="info">
          <RefreshIcon />
        </IconButton>
      </Stack>
    </Stack>
  )
}

export default ClientsHeader;

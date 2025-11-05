import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';

const OrdersHeader: ComponentType = () => {
  const { t } = useTranslation();

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

export default OrdersHeader;

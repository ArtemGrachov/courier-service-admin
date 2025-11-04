import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

import CouriersFilters from '~/routes/ViewCouriers/components/CouriersFilters';

const CouriersHeader: ComponentType = () => {
  const { t } = useTranslation();

  return (
    <Stack direction="row" justifyContent="space-between" gap={4}>
      <Stack direction="row" gap={2}>
        <IconButton color="info">
          <RefreshIcon />
        </IconButton>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddCircleOutlineIcon />}
        >
          {t('view_couriers.couriers_header.add_courier')}
        </Button>
      </Stack>
      <CouriersFilters />
    </Stack>
  )
}

export default CouriersHeader;

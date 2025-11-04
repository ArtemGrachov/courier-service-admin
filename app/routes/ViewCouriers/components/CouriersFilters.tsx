import { type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { ECourierStatus } from '~/constants/couriers';

const STATUS_OPTIONS = [
  ECourierStatus.DELIVERING,
  ECourierStatus.IDLE,
  ECourierStatus.OFFLINE,
  ECourierStatus.BLOCKED,
];

const CouriersFilters: ComponentType = () => {
  const { t, i18n } = useTranslation();

  return (
    <Stack
      direction="row"
      component="form"
      gap={2}
    >
      <TextField
        size="small"
        label={t('view_couriers.couriers_filters.name')}
      />
      <FormControl>
        <InputLabel
          htmlFor="status"
          size="small"
        >
          {t('view_couriers.couriers_filters.status')}
        </InputLabel>
        <Select
          id="status"
          size="small"
          label={t('view_couriers.couriers_filters.status')}
          sx={{ width: 140 }}
          multiple={true}
          defaultValue={[]}
        >
          {STATUS_OPTIONS.map(status => (
            <MenuItem value={status}>
              {t(`courier_status.${status}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel
          htmlFor="status"
          size="small"
        >
          {t('view_couriers.couriers_filters.rating')}
        </InputLabel>
        <Select
          size="small"
          label={t('view_couriers.couriers_filters.rating')}
          sx={{ width: 140 }}
        >

        </Select>
      </FormControl>
    </Stack>
  )
}

export default CouriersFilters;

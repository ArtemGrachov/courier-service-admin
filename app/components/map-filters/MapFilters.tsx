import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { EOrderStatus } from '~/constants/order';

import type { IClient } from '~/types/models/client';
import type { ICourier } from '~/types/models/courier';

interface IProps {
  couriers?: ICourier[] | null;
  senders?: IClient[] | null;
  receivers?: IClient[] | null;
}

const STATUS_OPTIONS = [
  EOrderStatus.ORDERED,
  EOrderStatus.PROCESSING,
];

const MapFilters: ComponentType<IProps> = ({ couriers, senders, receivers }) => {
  const { t } = useTranslation();

  const getOptionKey = (item: IClient | ICourier) => {
    return item.id;
  }

  const getOptionLabel = (item: IClient | ICourier) => {
    return item.name;
  }

  const renderValue = (v: Array<IClient | ICourier>) => {
    return t('map_filters.options_selected', { count: v.length });
  }

  return (
    <Stack gap={2} direction="row">
      <FormControl>
        <InputLabel size="small">
          {t('map_filters.status')}
        </InputLabel>
        <Select
          size="small"
          sx={{ width: 200 }}
          label={t('map_filters.status')}
        >
          {STATUS_OPTIONS.map(status => (
            <MenuItem value={status}>
              {t(`order_status.${status}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <Autocomplete
          options={senders ?? []}
          sx={{ width: 200 }}
          size="small"
          multiple={true}
          getOptionKey={getOptionKey}
          getOptionLabel={getOptionLabel}
          disableCloseOnSelect={true}
          renderValue={renderValue}
          renderInput={params => <TextField {...params} label={t('map_filters.senders')} />}
        />
      </FormControl>
      <FormControl>
        <Autocomplete
          options={receivers ?? []}
          sx={{ width: 200 }}
          size="small"
          multiple={true}
          getOptionKey={getOptionKey}
          getOptionLabel={getOptionLabel}
          disableCloseOnSelect={true}
          renderValue={renderValue}
          renderInput={params => <TextField {...params} label={t('map_filters.receivers')} />}
        />
      </FormControl>
      <FormControl>
        <Autocomplete
          options={couriers ?? []}
          sx={{ width: 200 }}
          size="small"
          multiple={true}
          getOptionKey={getOptionKey}
          getOptionLabel={getOptionLabel}
          disableCloseOnSelect={true}
          renderValue={renderValue}
          renderInput={params => <TextField {...params} label={t('map_filters.couriers')} />}
        />
      </FormControl>
    </Stack>
  )
}

export default MapFilters;

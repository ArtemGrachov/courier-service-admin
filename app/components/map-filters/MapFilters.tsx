import { useEffect, useMemo, type ComponentType, type SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import { type AutocompleteInputChangeReason } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { EOrderStatus } from '~/constants/order';

import { useOrderFilterCtx } from '~/providers/order-filters';

import AutocompleteExternal from '~/components/inputs/AutocompleExternal';

import type { IClient } from '~/types/models/client';
import type { ICourier } from '~/types/models/courier';
import type { IFormMapFilters } from '~/types/forms/form-map-filters';

interface IProps {
  formValue?: IFormMapFilters,
  onSubmit?: (formValue: IFormMapFilters) => any;
}

const STATUS_OPTIONS = [
  EOrderStatus.ORDERED,
  EOrderStatus.PROCESSING,
];

const SEARCH_QUERY = {
  itemsPerPage: 5,
};

const MapFilters: ComponentType<IProps> = observer(({ formValue, onSubmit }) => {
  const {
    sendersStore,
    receiversStore,
    couriersStore,
    fetchSenders,
    fetchReceivers,
    fetchCouriers,
  } = useOrderFilterCtx();

  const { control, register, getValues, reset } = useForm<IFormMapFilters>({
    defaultValues: formValue ?? {
      statuses: [],
      courierIds: [],
      sendersIds: [],
      receiverIds: [],
    },
  });

  const senders = useMemo(() => sendersStore.data?.data, [sendersStore.data]);
  const couriers = useMemo(() => couriersStore.data?.data, [couriersStore.data]);
  const receivers = useMemo(() => receiversStore.data?.data, [receiversStore.data]);

  console.log('senders1', senders);
  console.log('senders2', sendersStore.data?.data);

  const couriersMap = useMemo(() => {
    return couriers?.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as Record<number, ICourier>) ?? {};
  }, [couriers]);

  const sendersMap = useMemo(() => {
    return senders?.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as Record<number, IClient>) ?? {};
  }, [senders]);

  const recieversMap = useMemo(() => {
    return receivers?.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as Record<number, IClient>) ?? {};
  }, [receivers]);

  const senderOptions = useMemo(() => {
    console.log('senderOptions', senders?.map(s => s.id) ?? []);
    return senders?.map(s => s.id) ?? [];
  }, [senders]);

  const recieverOptions = useMemo(() => {
    return receivers?.map(s => s.id) ?? [];
  }, [receivers]);

  const courierOptions = useMemo(() => {
    return couriers?.map(s => s.id) ?? [];
  }, [couriers]);

  const { t } = useTranslation();

  const renderValue = (v: number[]) => {
    return t('map_filters.options_selected', { count: v.length });
  }

  const fieldStatuses = register('statuses');

  const submitHandler = () => {
    if (!onSubmit) {
      return;
    }

    const formValues = getValues();
    onSubmit(formValues);
  }

  const inputChangeHandler = (event: SyntheticEvent, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === 'clear') {
      setTimeout(() => {
        submitHandler();
      });
    }
  }

  useEffect(() => {
    reset(formValue);
  }, [formValue]);

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
          multiple={true}
          defaultValue={[]}
          {...fieldStatuses}
          onClose={submitHandler}
        >
          {STATUS_OPTIONS.map(status => (
            <MenuItem value={status} key={status}>
              {t(`order_status.${status}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <Controller
          control={control}
          name="sendersIds"
          render={({ field }) => (
            <AutocompleteExternal
              options={senderOptions}
              sx={{ width: 200 }}
              size="small"
              multiple={true}
              getOptionLabel={v => sendersMap[v]?.name}
              disableCloseOnSelect={true}
              renderValue={renderValue}
              renderInput={params => <TextField {...params} label={t('map_filters.senders')} />}
              {...field}
              onChange={(_, v) => field.onChange(v)}
              onClose={submitHandler}
              onInputChange={inputChangeHandler}
              onSearchLoad={search => fetchSenders({ ...SEARCH_QUERY, search })}
              onOpen={() => fetchSenders(SEARCH_QUERY)}
            />
          )}
        />
      </FormControl>
      <FormControl>
        <Controller
          control={control}
          name="receiverIds"
          render={({ field }) => (
            <AutocompleteExternal
              options={recieverOptions}
              sx={{ width: 200 }}
              size="small"
              multiple={true}
              getOptionLabel={v => recieversMap[v]?.name}
              disableCloseOnSelect={true}
              renderValue={renderValue}
              renderInput={params => <TextField {...params} label={t('map_filters.receivers')} />}
              {...field}
              onChange={(_, v) => field.onChange(v)}
              onClose={submitHandler}
              onInputChange={inputChangeHandler}
              onSearchLoad={search => fetchReceivers({ ...SEARCH_QUERY, search })}
              onOpen={() => fetchReceivers(SEARCH_QUERY)}
            />
          )}
        />
      </FormControl>
      <FormControl>
        <Controller
          control={control}
          name="courierIds"
          render={({ field }) => (
            <AutocompleteExternal
              options={courierOptions}
              sx={{ width: 200 }}
              size="small"
              multiple={true}
              getOptionLabel={v => couriersMap[v]?.name}
              disableCloseOnSelect={true}
              renderValue={renderValue}
              renderInput={params => <TextField {...params} label={t('map_filters.couriers')} />}
              {...field}
              onChange={(_, v) => field.onChange(v)}
              onClose={submitHandler}
              onInputChange={inputChangeHandler}
              onSearchLoad={search => fetchCouriers({ ...SEARCH_QUERY, search })}
              onOpen={() => fetchCouriers(SEARCH_QUERY)}
            />
          )}
        />
      </FormControl>
    </Stack>
  )
});

export default MapFilters;

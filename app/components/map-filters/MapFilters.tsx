import { useEffect, useMemo, type ComponentType, type SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm, type ControllerRenderProps } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { useDebouncedCallback } from 'use-debounce';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import {
  type AutocompleteChangeDetails,
  type AutocompleteChangeReason,
} from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { deepCompare } from 'deep-compare-advanced';

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

const EMPTY_FORM_VALUE = {
  status: null,
  courierIds: [],
  senderIds: [],
  receiverIds: [],
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

  const { control, getValues, register, reset, watch } = useForm<IFormMapFilters>({
    defaultValues: formValue ?? EMPTY_FORM_VALUE,
  });

  const orderIdField = register('orderId');

  const currentFormValue = watch();

  const senders = useMemo(() => sendersStore.data?.items, [sendersStore.data]);
  const couriers = useMemo(() => couriersStore.data?.items, [couriersStore.data]);
  const receivers = useMemo(() => receiversStore.data?.items, [receiversStore.data]);

  const hasValues = useMemo(() => {
    return currentFormValue.orderId ||
      currentFormValue.status ||
      currentFormValue.senderIds?.length ||
      currentFormValue.courierIds?.length ||
      currentFormValue.receiverIds?.length;
  }, [currentFormValue]);

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
    return t('common_filters.options_selected', { count: v.length });
  }

  const submitHandler = () => {
    if (!onSubmit) {
      return;
    }

    const submitFormValues = getValues();

    const isChanged = !deepCompare(formValue, submitFormValues)?.status;

    if (!isChanged) {
      return;
    }

    onSubmit(submitFormValues);
  }

  const submitDebounceQuick = useDebouncedCallback(() => {
    submitHandler();
  }, 200);

  const changeHandler = (
    field: ControllerRenderProps,
    _event: SyntheticEvent<Element, Event>,
    value: any,
    reason: AutocompleteChangeReason,
    _details?: AutocompleteChangeDetails<any> | undefined,
  ) => {
    field.onChange(value);

    if (reason === 'blur' || reason === 'clear') {
      submitHandler();
    }
  }

  const resetHandler = () => {
    reset(EMPTY_FORM_VALUE);
    submitHandler();
  }

  useEffect(() => {
    reset(formValue);
  }, [formValue]);

  return (
    <Stack gap={2} direction="row">
      <IconButton
        sx={{ alignSelf: 'center' }}
        disabled={!hasValues}
        color="error"
        onClick={resetHandler}
      >
        <CloseIcon />
      </IconButton>
      <FormControl>
        <TextField
          sx={{ width: 140 }}
          size="small"
          label={t('map_filters.order_id')}
          {...orderIdField}
          onChange={(e) => {
            orderIdField.onChange(e);
            submitDebounceQuick();
          }}
        />
      </FormControl>
      <FormControl>
        <InputLabel size="small">
          {t('map_filters.status')}
        </InputLabel>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              size="small"
              sx={{ width: 200 }}
              label={t('map_filters.status')}
              multiple={false}
              defaultValue={field.value ?? ''}
              {...field}
              value={field.value || ''}
              onClose={submitHandler}
            >
              <MenuItem value="">-</MenuItem>
              {STATUS_OPTIONS.map(status => (
                <MenuItem value={status} key={status}>
                  {t(`order_status.${status}`)}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
      <FormControl>
        <Controller
          control={control}
          name="senderIds"
          render={({ field }) => (
            <AutocompleteExternal
              options={senderOptions}
              sx={{ width: 200 }}
              size="small"
              multiple={true}
              getOptionLabel={v => sendersMap[v]?.name ?? '-'}
              disableCloseOnSelect={true}
              renderValue={renderValue}
              label={t('map_filters.senders')}
              searchMin={3}
              {...field}
              onChange={(e, v, r, d) => changeHandler(field, e, v, r, d)}
              onSearchLoad={search => fetchSenders({ ...SEARCH_QUERY, search })}
              onOpenLoad={() => fetchSenders(SEARCH_QUERY)}
              onClose={submitHandler}
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
              getOptionLabel={v => recieversMap[v]?.name ?? '-'}
              disableCloseOnSelect={true}
              renderValue={renderValue}
              label={t('map_filters.receivers')}
              searchMin={3}
              {...field}
              onChange={(e, v, r, d) => changeHandler(field, e, v, r, d)}
              onSearchLoad={search => fetchReceivers({ ...SEARCH_QUERY, search })}
              onOpenLoad={() => fetchReceivers(SEARCH_QUERY)}
              onClose={submitHandler}
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
              getOptionLabel={v => couriersMap[v]?.name ?? '-'}
              disableCloseOnSelect={true}
              renderValue={renderValue}
              label={t('map_filters.couriers')}
              searchMin={3}
              {...field}
              onChange={(e, v, r, d) => changeHandler(field, e, v, r, d)}
              onSearchLoad={search => fetchCouriers({ ...SEARCH_QUERY, search })}
              onOpenLoad={() => fetchCouriers(SEARCH_QUERY)}
              onClose={submitHandler}
            />
          )}
        />
      </FormControl>
    </Stack>
  )
});

export default MapFilters;

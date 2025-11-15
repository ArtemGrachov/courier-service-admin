import { type ComponentType, type SyntheticEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import type { GridFilterInputValueProps } from '@mui/x-data-grid';
import {
  type AutocompleteChangeDetails,
  type AutocompleteChangeReason,
} from '@mui/material/Autocomplete';

import { useOrderFilterCtx } from '~/providers/order-filters';

import AutocompleteExternal from '~/components/inputs/AutocompleExternal';

import type { IClient } from '~/types/models/client';

const SEARCH_QUERY = {
  itemsPerPage: 5,
};

const OrdersSendersOperator: ComponentType<GridFilterInputValueProps> = observer(({ item, applyValue, focusElementRef }) => {
  const { t } = useTranslation();

  const {
    sendersStore,
    fetchSenders,
  } = useOrderFilterCtx();

  const senders = useMemo(() => sendersStore.data?.data, [sendersStore.data]);

  const sendersMap = useMemo(() => {
    return senders?.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as Record<number, IClient>) ?? {};
  }, []);

  const senderOptions = useMemo(() => {
    return senders?.map(s => s.id) ?? [];
  }, [senders]);

  const renderValue = (v: number[]) => {
    return t('map_filters.options_selected', { count: v.length });
  }

  const changeHandler = (
    _event: SyntheticEvent<Element, Event>,
    value: number,
    _reason: AutocompleteChangeReason,
    _details?: AutocompleteChangeDetails<any> | undefined,
  ) => {
    applyValue({ ...item, value });
  }

  return (
    <AutocompleteExternal
      ref={focusElementRef}
      options={senderOptions}
      size="small"
      multiple={true}
      getOptionLabel={v => sendersMap[v]?.name ?? '-'}
      disableCloseOnSelect={true}
      renderValue={renderValue}
      label={t('orders_couriers_operator.label')}
      value={item.value ?? []}
      onChange={changeHandler}
      onSearchLoad={search => fetchSenders({ ...SEARCH_QUERY, search })}
      onOpenLoad={() => fetchSenders(SEARCH_QUERY)}
    />
  )
});

export default OrdersSendersOperator;


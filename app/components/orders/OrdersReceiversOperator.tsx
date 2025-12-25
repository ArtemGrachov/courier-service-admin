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

const OrderReceiversOperator: ComponentType<GridFilterInputValueProps> = observer(({ item, applyValue, focusElementRef }) => {
  const { t } = useTranslation();

  const {
    receiversStore,
    fetchReceivers,
  } = useOrderFilterCtx();

  const receivers = useMemo(() => receiversStore.data?.items, [receiversStore.data]);

  const couriersMap = useMemo(() => {
    return receivers?.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as Record<number, IClient>) ?? {};
  }, [receivers]);

  const receiverOptions = useMemo(() => {
    return receivers?.map(s => s.id) ?? [];
  }, [receivers]);

  const renderValue = (v: number[]) => {
    return t('common_filters.options_selected', { count: v.length });
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
      options={receiverOptions}
      size="small"
      multiple={true}
      getOptionLabel={v => couriersMap[v]?.name ?? '-'}
      disableCloseOnSelect={true}
      renderValue={renderValue}
      label={t('orders_receivers_operator.label')}
      value={item.value ?? []}
      searchMin={3}
      onChange={changeHandler}
      onSearchLoad={search => fetchReceivers({ ...SEARCH_QUERY, search })}
      onOpenLoad={() => fetchReceivers(SEARCH_QUERY)}
    />
  )
});

export default OrderReceiversOperator;


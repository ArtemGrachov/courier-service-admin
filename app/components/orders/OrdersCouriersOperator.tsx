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

import type { ICourier } from '~/types/models/courier';

const SEARCH_QUERY = {
  itemsPerPage: 5,
};

const OrdersCouriersOperator: ComponentType<GridFilterInputValueProps> = observer(({ item, applyValue, focusElementRef }) => {
  const { t } = useTranslation();

  const {
    couriersStore,
    fetchCouriers,
  } = useOrderFilterCtx();

  const couriers = useMemo(() => couriersStore.data?.data, [couriersStore.data]);

  const couriersMap = useMemo(() => {
    return couriers?.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as Record<number, ICourier>) ?? {};
  }, [couriers]);

  const courierOptions = useMemo(() => {
    return couriers?.map(s => s.id) ?? [];
  }, [couriers]);

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
      options={courierOptions}
      size="small"
      multiple={true}
      getOptionLabel={v => couriersMap[v]?.name ?? '-'}
      disableCloseOnSelect={true}
      renderValue={renderValue}
      label={t('orders_couriers_operator.label')}
      onChange={changeHandler}
      onSearchLoad={search => fetchCouriers({ ...SEARCH_QUERY, search })}
      onOpenLoad={() => fetchCouriers(SEARCH_QUERY)}
    />
  )
});

export default OrdersCouriersOperator;


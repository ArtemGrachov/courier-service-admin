import { useMemo, useRef, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getGridSingleSelectOperators,
  DataGrid,
  type GridColDef,
  type GridSingleSelectColDef,
  type GridFilterModel,
  type GridPaginationModel,
  type GridCallbackDetails,
  type GridSortModel,
  type GridFilterOperator,
} from '@mui/x-data-grid';
import { useDebouncedCallback } from 'use-debounce';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { EOrderStatus, ORDER_STATUSES } from '~/constants/order';
import { DATE_TIME_FORMAT } from '~/constants/datetime';
import type { ESortDirection } from '~/constants/sort';

import { useDataGridLabels } from '~/hooks/i18n/use-data-grid-labels';
import OrderStatus from '~/components/orders/OrderStatus';
import OrdersActionCell from '~/components/orders/OrdersActionCell'
import OrdersCourierLink from '~/components/orders/OrdersCourierLink';
import OrderReceiverCell from '~/components/orders/OrderReceiverCell';
import OrderSenderCell from '~/components/orders/OrderSenderCell';
import OrdersCouriersOperator from '~/components/orders/OrdersCouriersOperator';
import OrdersSendersOperator from '~/components/orders/OrdersSendersOperator';
import OrdersReceiversOperator from '~/components/orders/OrdersReceiversOperator';

import type { IOrder } from '~/types/models/order';
import type { ICourier } from '~/types/models/courier';
import type { IClient } from '~/types/models/client';
import type { IPagination } from '~/types/other/pagination';
import type { IFormOrdersFilter } from '~/types/forms/form-orders-filter';

dayjs.extend(utc);
dayjs.extend(timezone);

interface IProps {
  isProcessing?: boolean;
  items?: IOrder[];
  pagination?: IPagination;
  formValue?: IFormOrdersFilter;
  onUpdate?: (formValue: IFormOrdersFilter) => any;
}

const EMPTY = 'EMPTY';

const enum EColumns {
  ID = 'id',
  SENDER = 'sender',
  RECEIVER = 'receiver',
  COURIER = 'courier',
  STATUS = 'status',
  ORDERED_AT = 'orderedAt',
  CLOSED_AT = 'closedAt',
  ACTIONS = 'actions',
}

const SELECT_OPERATORS = [
  getGridSingleSelectOperators().find(o => o.value === 'isAnyOf')!,
];

const SENDERS_OPERATORS: GridFilterOperator<any, number[]>[] = [
  {
    label: 'Any of',
    value: 'isAnyOf',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }
      return (value) => {
        return Number(value) >= Number(filterItem.value);
      };
    },
    InputComponent: OrdersSendersOperator,
    getValueAsString: (value: number) => value.toString(),
  }
];

const RECEIVERS_OPERATORS: GridFilterOperator<any, number[]>[] = [
  {
    label: 'Any of',
    value: 'isAnyOf',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }
      return (value) => {
        return Number(value) >= Number(filterItem.value);
      };
    },
    InputComponent: OrdersReceiversOperator,
    getValueAsString: (value: number) => value.toString(),
  }
];

const COURIERS_OPERATORS: GridFilterOperator<any, number[]>[] = [
  {
    label: 'Any of',
    value: 'isAnyOf',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }
      return (value) => {
        return Number(value) >= Number(filterItem.value);
      };
    },
    InputComponent: OrdersCouriersOperator,
    getValueAsString: (value: number) => value.toString(),
  }
];
  
const BASE_COLUMNS: Record<EColumns, GridColDef> = {
  [EColumns.ID]: {
    field: 'id',
    headerName: 'orders_table.id',
    width: 70,
    sortable: false,
    filterable: false,
  },
  [EColumns.SENDER]: {
    field: 'sender',
    type: 'string',
    headerName: 'orders_table.sender',
    flex: 1,
    valueFormatter: (v: IClient | undefined) => v?.name ?? '-',
    filterOperators: SENDERS_OPERATORS,
    renderCell: (params) => useMemo(() => <OrderSenderCell params={params} />, [params.row?.sender?.id]),
    valueGetter: (v: IClient | undefined) => v?.name ?? '-',
    sortable: false,
    filterable: true,
  },
  [EColumns.RECEIVER]: {
    field: 'receiver',
    type: 'string',
    headerName: 'orders_table.receiver',
    flex: 1,
    valueFormatter: (v: IClient | undefined) => v?.name ?? '-',
    filterOperators: RECEIVERS_OPERATORS,
    renderCell: (params) => useMemo(() => <OrderReceiverCell params={params} />, [params.row?.receiver?.id]),
    valueGetter: (v: IClient | undefined) => v?.name ?? '-',
    sortable: false,
    filterable: true,
  },
  [EColumns.COURIER]: {
    field: 'courier',
    type: 'string',
    headerName: 'orders_table.courier',
    flex: 1,
    valueFormatter: (v: ICourier | undefined) => v?.name ?? '-',
    filterOperators: COURIERS_OPERATORS,
    renderCell: (params) => useMemo(() => <OrdersCourierLink params={params} />, [params.row?.client?.id]),
    sortable: false,
    filterable: true,
  },
  [EColumns.STATUS]: {
    field: 'status',
    type: 'singleSelect',
    headerName: 'orders_table.status',
    flex: 1,
    renderCell: params => useMemo(() => <OrderStatus status={params.value} />, [params.value]),
    valueOptions: ORDER_STATUSES,
    filterOperators: SELECT_OPERATORS,
    sortable: false,
    filterable: true,
  } as GridSingleSelectColDef,
  [EColumns.ORDERED_AT]: {
    field: 'dateTimeOrdered',
    type: 'dateTime',
    headerName: 'orders_table.ordered_at',
    flex: 1,
    valueGetter: v => v ? new Date(v) : null,
    valueFormatter: v => v ? dayjs(v).format(DATE_TIME_FORMAT) : '-',
    sortable: true,
    filterable: false,
  },
  [EColumns.CLOSED_AT]: {
    field: 'dateTimeClosed',
    type: 'dateTime',
    headerName: 'orders_table.closed_at',
    flex: 1,
    valueGetter: v => v ? new Date(v) : null,
    valueFormatter: v => v ? dayjs(v).format(DATE_TIME_FORMAT) : '-',
    sortable: true,
    filterable: false,
  },
  [EColumns.ACTIONS]: {
    field: 'actions',
    type: 'custom',
    headerName: EMPTY,
    width: 60,
    renderCell: (params) => useMemo(() => <OrdersActionCell params={params} />, [params.id]),
    filterable: false,
    sortable: false,
    hideable: false,
  },
};

const OrdersTable: ComponentType<IProps> = ({ isProcessing, items, pagination, formValue, onUpdate }) => {
  const { t, i18n } = useTranslation();
  const localeText = useDataGridLabels();

  const outputColumns = useMemo((): GridColDef[] => {
    const statusCol = BASE_COLUMNS[EColumns.STATUS] as GridSingleSelectColDef;

    return [
      BASE_COLUMNS[EColumns.ID],
      BASE_COLUMNS[EColumns.SENDER],
      BASE_COLUMNS[EColumns.RECEIVER],
      BASE_COLUMNS[EColumns.COURIER],
      {
        ...statusCol,
        valueOptions: (statusCol.valueOptions as EOrderStatus[]).map(status => ({
          value: status,
          label: t(`order_status.${status}`)
        }))
      } as GridColDef,
      BASE_COLUMNS[EColumns.ORDERED_AT],
      BASE_COLUMNS[EColumns.CLOSED_AT],
      BASE_COLUMNS[EColumns.ACTIONS],
    ].map(col => ({
      ...col,
      headerName: col.headerName ? col.headerName === EMPTY ? '' : t(col.headerName) : undefined,
    }));
  }, [i18n.language]);

  const handleUpdate = () => {
    if (!onUpdate) {
      return;
    }

    const payload: IFormOrdersFilter = {
      page: 1,
      itemsPerPage: 5,
    };

    const pgMdl = paginationModel.current;

    if (pgMdl) {
      payload.page = (pgMdl.page ?? 0) + 1,
      payload.itemsPerPage = pgMdl.pageSize;
    }

    const fltrMdl = filtersModel.current;

    if (fltrMdl) {
      let statuses;
      let courierIds;
      let senderIds;
      let receiverIds;

      for (let i = 0; i < fltrMdl.items.length; i++) {
        const item = fltrMdl.items[i];

        switch (item.field) {
          case 'status': {
            statuses = item.value;
            break;
          }
          case 'courier': {
            courierIds = item.value;
            break;
          }
          case 'sender': {
            senderIds = item.value;
            break;
          }
          case 'receiver': {
            receiverIds = item.value;
            break;
          }
        }
      }

      payload.statuses = statuses;
      payload.courierIds = courierIds;
      payload.senderIds = senderIds;
      payload.receiverIds = receiverIds;
    }

    const sortBy = sortModel.current?.[0];

    if (sortBy?.sort) {
      switch (sortBy.field) {
        case 'dateTimeOrdered': {
          payload.dateTimeOrderedSort = sortBy.sort as ESortDirection;
          break;
        }
        case 'dateTimeClosed': {
          payload.dateTimeClosedSort = sortBy.sort as ESortDirection;
          break;
        }
      }
    }

    onUpdate(payload);
  }

  const updateDebounce = useDebouncedCallback(handleUpdate, 300);

  const paginationChangeHandler = (model: GridPaginationModel) => {
    paginationModel.current = model;
    handleUpdate();
  }

  const filtersModelChangeHandler = (model: GridFilterModel, details: GridCallbackDetails<'filter'>) => {
    if (!details.reason) {
      return;
    }

    filtersModel.current = model;

    if (paginationModel.current) {
      paginationModel.current.page = 0;
    }

    updateDebounce();
  }

  const sortModelChangeHandler = (model: GridSortModel) => {
    sortModel.current = model;
    updateDebounce();
  }

  const inputPaginationModel = useMemo(() => {
    return {
      paginationModel: {
        page: (formValue?.page ?? pagination?.currentPage ?? 1) - 1,
        pageSize: formValue?.itemsPerPage ?? pagination?.itemsPerPage ?? 5,
      },
    };
  }, [pagination])

  const inputFilter = useMemo(() => {
    if (!formValue) {
      return undefined;
    }

    const items = [];

    if (formValue.statuses) {
      items.push({
        field: 'status',
        operator: 'isAnyOf',
        value: formValue.statuses,
      });
    }

    if (formValue.courierIds) {
      items.push({
        field: 'courier',
        operator: 'isAnyOf',
        value: formValue.courierIds,
      });
    }

    if (formValue.senderIds) {
      items.push({
        field: 'sender',
        operator: 'isAnyOf',
        value: formValue.senderIds,
      });
    }

    if (formValue.receiverIds) {
      items.push({
        field: 'receiver',
        operator: 'isAnyOf',
        value: formValue.receiverIds,
      });
    }

    return {
      filterModel: {
        items,
      },
    };
  }, [formValue]);

  const inputSorting = useMemo(() => {
    const sortModel = [];

    if (formValue?.dateTimeOrderedSort) {
      sortModel.push({
        field: 'dateTimeOrdered',
        sort: formValue.dateTimeOrderedSort,
      });
    }

    if (formValue?.dateTimeClosedSort) {
      sortModel.push({
        field: 'dateTimeClosed',
        sort: formValue.dateTimeClosedSort,
      });
    }

    return { sortModel };
  }, [formValue]);

  const initialState = useMemo(() => {
    return {
      pagination: inputPaginationModel,
      filter: inputFilter,
      sorting: inputSorting,
    };
  }, [inputPaginationModel, inputFilter, inputSorting]);

  const paginationModel = useRef<GridPaginationModel | null>(inputPaginationModel.paginationModel);
  const filtersModel = useRef<GridFilterModel | null>(inputFilter?.filterModel);
  const sortModel = useRef<GridSortModel | null>(inputSorting?.sortModel);

  return (
    <DataGrid
      sx={{ width: '100%', boxSizing: 'border-box' }}
      columns={outputColumns}
      rows={items}
      loading={isProcessing}
      showToolbar={true}
      localeText={localeText}
      pageSizeOptions={[5, 10, 25]}
      initialState={initialState}
      rowCount={pagination?.totalItems ?? 0}
      paginationMode="server"
      sortingMode="server"
      filterMode="server"
      onPaginationModelChange={paginationChangeHandler}
      onFilterModelChange={filtersModelChangeHandler}
      onSortModelChange={sortModelChangeHandler}
    />
  )
}

export default OrdersTable;

import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DataGrid,
  type GridColDef,
  type GridSingleSelectColDef,
} from '@mui/x-data-grid';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { DATE_TIME_FORMAT } from '~/constants/datetime';

import { useDataGridLabels } from '~/hooks/i18n/use-data-grid-labels';
import OrderStatus from '~/components/orders/OrderStatus';
import OrdersActionCell from '~/components/orders/OrdersActionCell'
import OrdersCourierLink from '~/components/orders/OrdersCourierLink';
import OrderReceiverCell from '~/components/orders/OrderReceiverCell';
import OrderSenderCell from '~/components/orders/OrderSenderCell';

import type { IOrder } from '~/types/models/order';
import type { ICourier } from '~/types/models/courier';
import type { IClient } from '~/types/models/client';
import type { IFormOrdersFilter } from '~/types/forms/form-orders-filter';

dayjs.extend(utc);
dayjs.extend(timezone);

interface IProps {
  isProcessing?: boolean;
  items?: IOrder[];
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
    renderCell: (params) => useMemo(() => <OrderSenderCell params={params} />, [params.row?.sender?.id]),
    valueGetter: (v: IClient | undefined) => v?.name ?? '-',
    sortable: false,
    filterable: false,
  },
  [EColumns.RECEIVER]: {
    field: 'receiver',
    type: 'string',
    headerName: 'orders_table.receiver',
    flex: 1,
    valueFormatter: (v: IClient | undefined) => v?.name ?? '-',
    renderCell: (params) => useMemo(() => <OrderReceiverCell params={params} />, [params.row?.receiver?.id]),
    valueGetter: (v: IClient | undefined) => v?.name ?? '-',
    sortable: false,
    filterable: false,
  },
  [EColumns.COURIER]: {
    field: 'courier',
    type: 'string',
    headerName: 'orders_table.courier',
    flex: 1,
    valueFormatter: (v: ICourier | undefined) => v?.name ?? '-',
    renderCell: (params) => useMemo(() => <OrdersCourierLink params={params} />, [params.row?.client?.id]),
    sortable: false,
    filterable: false,
  },
  [EColumns.STATUS]: {
    field: 'status',
    type: 'singleSelect',
    headerName: 'orders_table.status',
    flex: 1,
    renderCell: params => useMemo(() => <OrderStatus status={params.value} />, [params.value]),
    sortable: false,
    filterable: false,
  } as GridSingleSelectColDef,
  [EColumns.ORDERED_AT]: {
    field: 'dateTimeOrdered',
    type: 'dateTime',
    headerName: 'orders_table.ordered_at',
    flex: 1,
    valueGetter: v => v ? new Date(v) : null,
    valueFormatter: v => v ? dayjs(v).format(DATE_TIME_FORMAT) : '-',
    sortable: false,
    filterable: false,
  },
  [EColumns.CLOSED_AT]: {
    field: 'dateTimeClosed',
    type: 'dateTime',
    headerName: 'orders_table.closed_at',
    flex: 1,
    valueGetter: v => v ? new Date(v) : null,
    valueFormatter: v => v ? dayjs(v).format(DATE_TIME_FORMAT) : '-',
    sortable: false,
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

const OrdersTablePreview: ComponentType<IProps> = ({ isProcessing, items }) => {
  const { t, i18n } = useTranslation();
  const localeText = useDataGridLabels();

  const outputColumns = useMemo((): GridColDef[] => {
    return [
      BASE_COLUMNS[EColumns.ID],
      BASE_COLUMNS[EColumns.SENDER],
      BASE_COLUMNS[EColumns.RECEIVER],
      BASE_COLUMNS[EColumns.COURIER],
      BASE_COLUMNS[EColumns.STATUS],
      BASE_COLUMNS[EColumns.ORDERED_AT],
      BASE_COLUMNS[EColumns.ACTIONS],
    ].map(col => ({
      ...col,
      headerName: col.headerName ? col.headerName === EMPTY ? '' : t(col.headerName) : undefined,
    }));
  }, [i18n.language]);

  return (
    <DataGrid
      sx={{ width: '100%', boxSizing: 'border-box' }}
      columns={outputColumns}
      rows={items}
      loading={isProcessing}
      showToolbar={false}
      hideFooter={true}
      localeText={localeText}
      paginationMode="server"
      sortingMode="server"
      filterMode="server"
      rowCount={items?.length ?? 0}
    />
  )
}

export default OrdersTablePreview;

import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { DataGrid, GridCell, type GridColDef, type GridSingleSelectColDef } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Link } from '@mui/material';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { EOrderStatus, ORDER_STATUSES } from '~/constants/order';
import { DATE_TIME_FORMAT } from '~/constants/datetime';
import { ROUTE_PATHS, ROUTES } from '~/router/routes';

import { useDataGridLabels } from '~/hooks/i18n/use-data-grid-labels';
import { useRoutePath } from '~/hooks/routing/use-route-path';
import OrderStatus from '~/components/orders/OrderStatus';

import type { IOrder } from '~/types/models/order';
import type { ICourier } from '~/types/models/courier';
import type { IClient } from '~/types/models/client';

dayjs.extend(utc);
dayjs.extend(timezone);

interface IProps {
  isProcessing?: boolean;
  items?: IOrder[];
}

const EMPTY = 'EMPTY';

const enum EColumns {
  ID = 'id',
  CLIENT = 'client',
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
  },
  [EColumns.CLIENT]: {
    field: 'client',
    type: 'string',
    headerName: 'orders_table.client',
    flex: 1,
    valueFormatter: (v: IClient | undefined) => v?.name ?? '-',
    renderCell: (params) => {
      const client = (params.row as IOrder).client;
      const routePath = useRoutePath();

      if (!client) {
        return '-';
      }

      return (
        <Link
          to={routePath(ROUTES.CLIENT, { clientId: client.id })}
          component={RouterLink}
        >
          {client.name}
        </Link>
      )
    },
  },
  [EColumns.COURIER]: {
    field: 'courier',
    type: 'string',
    headerName: 'orders_table.courier',
    flex: 1,
    valueFormatter: (v: ICourier | undefined) => v?.name ?? '-',
    renderCell: (params) => {
      const courier = (params.row as IOrder).courier;
      const routePath = useRoutePath();

      if (!courier) {
        return '-';
      }

      return (
        <Link
          to={routePath(ROUTES.COURIER, { courierId: courier.id })}
          component={RouterLink}
        >
          {courier.name}
        </Link>
      )
    },
  },
  [EColumns.STATUS]: {
    field: 'status',
    type: 'singleSelect',
    headerName: 'orders_table.status',
    flex: 1,
    renderCell: params => <OrderStatus status={params.value} />,
    valueOptions: ORDER_STATUSES,
  } as GridSingleSelectColDef,
  [EColumns.ORDERED_AT]: {
    field: 'dateTimeOrdered',
    type: 'dateTime',
    headerName: 'orders_table.ordered_at',
    flex: 1,
    valueGetter: v => v ? new Date(v) : null,
    valueFormatter: v => v ? dayjs(v).format(DATE_TIME_FORMAT) : '-',
  },
  [EColumns.CLOSED_AT]: {
    field: 'dateTimeClosed',
    type: 'dateTime',
    headerName: 'orders_table.closed_at',
    flex: 1,
    valueGetter: v => v ? new Date(v) : null,
    valueFormatter: v => v ? dayjs(v).format(DATE_TIME_FORMAT) : '-',
  },
  [EColumns.ACTIONS]: {
    field: 'actions',
    type: 'custom',
    headerName: EMPTY,
    width: 60,
    renderCell: (params) => {
      const { t } = useTranslation();
      const order = params.row as IOrder;
      const routePath = useRoutePath();

      return (
        <IconButton
          component={RouterLink}
          to={routePath(ROUTE_PATHS.ORDER, { orderId: order.id })}
          aria-label={t('orders_table.details')}
        >
          <RemoveRedEyeIcon />
        </IconButton>
      )
    },
    filterable: false,
    sortable: false,
    hideable: false,
  },
};

const OrdersTable: ComponentType<IProps> = ({ isProcessing, items }) => {
  const { t, i18n } = useTranslation();
  const localeText = useDataGridLabels();

  const outputColumns = useMemo((): GridColDef[] => {
    const statusCol = BASE_COLUMNS[EColumns.STATUS] as GridSingleSelectColDef;

    return [
      BASE_COLUMNS[EColumns.ID],
      BASE_COLUMNS[EColumns.CLIENT],
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

  return (
    <DataGrid
      sx={{ width: '100%', boxSizing: 'border-box' }}
      columns={outputColumns}
      rows={items}
      loading={isProcessing}
      slots={{
        cell: props => (<GridCell {...props}></GridCell>),
      }}
      showToolbar={true}
      localeText={localeText}
    />
  )
}

export default OrdersTable;

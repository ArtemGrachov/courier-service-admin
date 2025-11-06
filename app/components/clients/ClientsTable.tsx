import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import Link from '@mui/material/Link';
import { DataGrid, GridCell, type GridColDef } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import { ROUTE_PATHS } from '~/router/routes';

import { useDataGridLabels } from '~/hooks/i18n/use-data-grid-labels';
import { useRoutePath } from '~/hooks/routing/use-route-path';
import Rating from '~/components/other/Rating';

import type { IClient } from '~/types/models/client';

interface IProps {
  isProcessing?: boolean;
  items?: IClient[];
}

const EMPTY = 'EMPTY';

const enum EColumns {
  ID = 'id',
  NAME = 'name',
  PHONE = 'phone',
  EMAIL = 'email',
  CURRENT_ORDERS_COUNT = 'currentOrdersCount',
  TOTAL_ORDERS_COUNT = 'totalOrdersCount',
  RATING = 'rating',
  ACTIONS = 'actions',
}

const BASE_COLUMNS: Record<EColumns, GridColDef> = {
  [EColumns.ID]: {
    field: 'id',
    headerName: 'clients_table.id',
    width: 70,
  },
  [EColumns.NAME]: {
    field: 'name',
    type: 'string',
    headerName: 'clients_table.name',
    flex: 1,
  },
  [EColumns.PHONE]: {
    field: 'phoneNumber',
    type: 'string',
    headerName: 'clients_table.phone',
    flex: 1,
    renderCell: params => params.value ? (
      <Link
        component="a"
        href={`tel:${params.value}`}
      >
        {params.value}
      </Link>
    ) : '-',
  },
  [EColumns.EMAIL]: {
    field: 'email',
    type: 'string',
    headerName: 'clients_table.email',
    flex: 1,
    renderCell: params => params.value ? (
      <Link
        component="a"
        href={`mailto:${params.value}`}
        target="_blank"
      >
        {params.value}
      </Link>
    ) : '-',
  },
  [EColumns.CURRENT_ORDERS_COUNT]: {
    field: 'currentOrdersCount',
    type: 'number',
    headerName: 'clients_table.current_orders_count',
    flex: 1,
  },
  [EColumns.TOTAL_ORDERS_COUNT]: {
    field: 'totalOrdersCount',
    type: 'number',
    headerName: 'clients_table.total_orders_count',
    flex: 1,
  },
  [EColumns.RATING]: {
    field: 'rating',
    type: 'number',
    headerName: 'clients_table.rating',
    width: 100,
    renderCell: params => <Rating rating={params.value} />
  },
  [EColumns.ACTIONS]: {
    field: 'actions',
    type: 'custom',
    headerName: EMPTY,
    width: 60,
    renderCell: (params) => {
      const { t } = useTranslation();
      const client = params.row as IClient;
      const routePath = useRoutePath();

      return (
        <IconButton
          component={RouterLink}
          to={routePath(ROUTE_PATHS.CLIENT, { clientId: client.id })}
          aria-label={t('clients_table.details')}
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

const ClientsTable: ComponentType<IProps> = ({ isProcessing, items }) => {
  const { t, i18n } = useTranslation();
  const localeText = useDataGridLabels();

  const outputColumns = useMemo((): GridColDef[] => {
    return [
      BASE_COLUMNS[EColumns.ID],
      BASE_COLUMNS[EColumns.NAME],
      BASE_COLUMNS[EColumns.EMAIL],
      BASE_COLUMNS[EColumns.PHONE],
      BASE_COLUMNS[EColumns.CURRENT_ORDERS_COUNT],
      BASE_COLUMNS[EColumns.TOTAL_ORDERS_COUNT],
      BASE_COLUMNS[EColumns.RATING],
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

export default ClientsTable;

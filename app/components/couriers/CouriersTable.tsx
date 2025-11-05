import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGrid, GridCell, type GridColDef, type GridSingleSelectColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

import { COURIER_STATUSES, ECourierStatus } from '~/constants/couriers';

import { useDataGridLabels } from '~/hooks/i18n/use-data-grid-labels';
import CourierStatus from '~/components/couriers/CourierStatus';
import CourierRating from '~/components/couriers/CourierRating';

import type { ICourier } from '~/types/models/courier';

interface IProps {
  isProcessing?: boolean;
  items?: ICourier[];
}

const EMPTY = 'EMPTY';

const enum EColumns {
  ID = 'id',
  NAME = 'name',
  STATUS = 'status',
  CURRENT_ORDERS_COUNT = 'currentOrdersCount',
  TOTAL_ORDERS_COUNT = 'totalOrdersCount',
  RATING = 'rating',
  ACTIONS = 'actions',
}

const BASE_COLUMNS: Record<EColumns, GridColDef> = {
  [EColumns.ID]: {
    field: 'id',
    headerName: 'couriers_table.id',
    width: 70,
  },
  [EColumns.NAME]: {
    field: 'name',
    type: 'string',
    headerName: 'couriers_table.name',
    flex: 1,
  },
  [EColumns.STATUS]: {
    field: 'status',
    type: 'singleSelect',
    headerName: 'couriers_table.status',
    flex: 1,
    renderCell: params => <CourierStatus status={params.value} />,
    valueOptions: COURIER_STATUSES,
  } as GridSingleSelectColDef,
  [EColumns.CURRENT_ORDERS_COUNT]: {
    field: 'currentOrdersCount',
    type: 'number',
    headerName: 'couriers_table.current_orders_count',
    flex: 1,
  },
  [EColumns.TOTAL_ORDERS_COUNT]: {
    field: 'totalOrdersCount',
    type: 'number',
    headerName: 'couriers_table.total_orders_count',
    flex: 1,
  },
  [EColumns.RATING]: {
    field: 'rating',
    type: 'number',
    headerName: 'couriers_table.rating',
    width: 100,
    renderCell: params => <CourierRating rating={params.value} />
  },
  [EColumns.ACTIONS]: {
    field: 'actions',
    type: 'custom',
    headerName: EMPTY,
    width: 200,
    renderCell: (params) => {
      const { t } = useTranslation();
      return (
        <Button>
          {t('couriers_table.details')}
        </Button>
      )
    },
    filterable: false,
    sortable: false,
    hideable: false,
  },
};

const CouriersTable: ComponentType<IProps> = ({ isProcessing, items }) => {
  const { t, i18n } = useTranslation();
  const localeText = useDataGridLabels();

  const outputColumns = useMemo((): GridColDef[] => {
    const statusCol = BASE_COLUMNS[EColumns.STATUS] as GridSingleSelectColDef;

    return [
      BASE_COLUMNS[EColumns.ID],
      BASE_COLUMNS[EColumns.NAME],
      {
        ...statusCol,
        valueOptions: (statusCol.valueOptions as ECourierStatus[]).map(status => ({
          value: status,
          label: t(`courier_status.${status}`)
        }))
      } as GridColDef,
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

export default CouriersTable;

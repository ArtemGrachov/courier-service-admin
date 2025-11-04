import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGrid, GridCell, type GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

import type { ICourier } from '~/types/models/courier';
import CourierStatus from '~/components/couriers/CourierStatus';
import CourierRating from '~/components/couriers/CourierRating';

interface IProps {
  isProcessing?: boolean;
  items?: ICourier[];
}

const EMPTY = 'EMPTY';

const COLUMNS: GridColDef[] = [
  {
    field: 'id',
    headerName: 'couriers_table.id',
    width: 70,
  },
  {
    field: 'name',
    headerName: 'couriers_table.name',
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'couriers_table.status',
    flex: 1,
    renderCell: params => <CourierStatus status={params.value} />
  },
  {
    field: 'currentOrdersCount',
    headerName: 'couriers_table.current_orders_count',
    flex: 1,
  },
  {
    field: 'totalOrdersCount',
    headerName: 'couriers_table.total_orders_count',
    flex: 1,
  },
  {
    field: 'rating',
    headerName: 'couriers_table.rating',
    width: 100,
    renderCell: params => <CourierRating rating={params.value} />
  },
  {
    field: 'actions',
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
  },
];

const CouriersTable: ComponentType<IProps> = ({ isProcessing, items }) => {
  const { t, i18n } = useTranslation();

  const outputColumns = useMemo(() => {
    return COLUMNS.map(col => ({
      ...col,
      headerName: col.headerName ? col.headerName === EMPTY ? '' : t(col.headerName) : undefined,
    }));
  }, [i18n.language]);

  return (
    <DataGrid
      sx={{ width: '100%' }}
      columns={outputColumns}
      rows={items}
      loading={isProcessing}
      slots={{
        cell: props => (<GridCell {...props}></GridCell>),
      }}
    />
  )
}

export default CouriersTable;

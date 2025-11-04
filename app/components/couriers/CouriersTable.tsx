import { useMemo, type ComponentType } from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

import type { ICourier } from '~/types/models/courier';

interface IProps {
  items?: ICourier[];
}

const COLUMNS: GridColDef[] = [
  { field: 'id', headerName: 'couriers_table.id', width: 70 },
  { field: 'name', headerName: 'couriers_table.name', flex: 1 },
  { field: 'status', headerName: 'couriers_table.status', flex: 1 },
  { field: 'currentOrdersCount', headerName: 'couriers_table.current_orders_count', flex: 1 },
  { field: 'totalOrdersCount', headerName: 'couriers_table.total_orders_count', flex: 1 },
  { field: 'rating', headerName: 'couriers_table.rating', width: 100 },
];

const CouriersTable: ComponentType<IProps> = ({ items }) => {
  const { t, i18n } = useTranslation();

  const outputColumns = useMemo(() => {
    return COLUMNS.map(col => ({
      ...col,
      headerName: col.headerName ? t(col.headerName) : undefined,
    }));
  }, [i18n.language]);

  return (
    <DataGrid
      sx={{ width: '100%' }}
      columns={outputColumns}
    />
  )
}

export default CouriersTable;

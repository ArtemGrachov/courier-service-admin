import { useMemo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DataGrid,
  type GridColDef,
  type GridSingleSelectColDef,
} from '@mui/x-data-grid';

import { useDataGridLabels } from '~/hooks/i18n/use-data-grid-labels';
import CourierStatus from '~/components/couriers/CourierStatus';
import CouriersActionCell from '~/components/couriers/CouriersActionCell';
import PhoneCell from '~/components/tables/PhoneCell';
import EmailCell from '~/components/tables/EmailCell';
import Rating from '~/components/other/Rating';

import type { ICourier } from '~/types/models/courier';
import type { IFormCouriersFilter } from '~/types/forms/form-couriers-filter';
import type { IPagination } from '~/types/other/pagination';

interface IProps {
  isProcessing?: boolean;
  items?: ICourier[];
  pagination?: IPagination;
  formValue?: IFormCouriersFilter;
  onUpdate?: (formValue: IFormCouriersFilter) => any;
}

const EMPTY = 'EMPTY';

const enum EColumns {
  ID = 'id',
  NAME = 'name',
  PHONE = 'phone',
  EMAIL = 'email',
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
    filterable: false,
    sortable: false,
  },
  [EColumns.NAME]: {
    field: 'name',
    type: 'string',
    headerName: 'couriers_table.name',
    flex: 1,
    filterable: false,
    sortable: false,
  },
  [EColumns.PHONE]: {
    field: 'phoneNumber',
    type: 'string',
    headerName: 'couriers_table.phone',
    flex: 1,
    renderCell: params => useMemo(() => <PhoneCell params={params} />, [params.id]),
    filterable: false,
    sortable: false,
  },
  [EColumns.EMAIL]: {
    field: 'email',
    type: 'string',
    headerName: 'couriers_table.email',
    flex: 1,
    renderCell: params => useMemo(() => <EmailCell params={params} />, [params.id]),
    filterable: false,
    sortable: false,
  },
  [EColumns.STATUS]: {
    field: 'status',
    type: 'singleSelect',
    headerName: 'couriers_table.status',
    flex: 1,
    renderCell: params => <CourierStatus status={params.value} />,
    filterable: false,
    sortable: false,
    getOptionLabel: o => (o as unknown as any)?.label,
    getOptionValue: o => (o as unknown as any)?.value,
  } as GridSingleSelectColDef,
  [EColumns.CURRENT_ORDERS_COUNT]: {
    field: 'currentOrdersCount',
    type: 'number',
    headerName: 'couriers_table.current_orders_count',
    flex: 1,
    sortable: true,
    filterable: false,
  },
  [EColumns.TOTAL_ORDERS_COUNT]: {
    field: 'totalOrdersCount',
    type: 'number',
    headerName: 'couriers_table.total_orders_count',
    flex: 1,
    filterable: false,
    sortable: false,
  },
  [EColumns.RATING]: {
    field: 'rating',
    type: 'number',
    headerName: 'couriers_table.rating',
    width: 100,
    renderCell: params => <Rating rating={params.value} />,
    filterable: false,
    sortable: false,
  },
  [EColumns.ACTIONS]: {
    field: 'actions',
    type: 'custom',
    headerName: EMPTY,
    width: 110,
    renderCell: params => useMemo(() => <CouriersActionCell params={params} />, [params.id]),
    filterable: false,
    sortable: false,
    hideable: false,
  },
};

const CouriersTablePreview: ComponentType<IProps> = ({ isProcessing, items }) => {
  const { t, i18n } = useTranslation();
  const localeText = useDataGridLabels();

  const outputColumns = useMemo((): GridColDef[] => {
    return [
      BASE_COLUMNS[EColumns.ID],
      BASE_COLUMNS[EColumns.NAME],
      BASE_COLUMNS[EColumns.EMAIL],
      BASE_COLUMNS[EColumns.PHONE],
      BASE_COLUMNS[EColumns.STATUS],
      BASE_COLUMNS[EColumns.CURRENT_ORDERS_COUNT],
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

export default CouriersTablePreview;


import { useMemo, useRef, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebouncedCallback } from 'use-debounce';
import {
  DataGrid,
  getGridStringOperators,
  getGridSingleSelectOperators,
  type GridCallbackDetails,
  type GridColDef,
  type GridSingleSelectColDef,
  type GridPaginationModel,
  type GridFilterModel,
  type GridSortModel,
} from '@mui/x-data-grid';

import { COURIER_STATUSES, DEFAULT_COURIER_FILTERS, ECourierStatus } from '~/constants/couriers';
import type { ESortDirection } from '~/constants/sort';

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

const STRING_OPERATORS = [
  getGridStringOperators().find(o => o.value === 'contains')!,
];

const SELECT_OPERATORS = [
  getGridSingleSelectOperators().find(o => o.value === 'isAnyOf')!,
];

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
    sortable: true,
    filterable: true,
    filterOperators: STRING_OPERATORS,
  },
  [EColumns.PHONE]: {
    field: 'phoneNumber',
    type: 'string',
    headerName: 'couriers_table.phone',
    flex: 1,
    renderCell: params => useMemo(() => <PhoneCell params={params} />, [params.id]),
    sortable: false,
    filterable: true,
    filterOperators: STRING_OPERATORS,
  },
  [EColumns.EMAIL]: {
    field: 'email',
    type: 'string',
    headerName: 'couriers_table.email',
    flex: 1,
    renderCell: params => useMemo(() => <EmailCell params={params} />, [params.id]),
    sortable: false,
    filterable: true,
    filterOperators: STRING_OPERATORS,
  },
  [EColumns.STATUS]: {
    field: 'status',
    type: 'singleSelect',
    headerName: 'couriers_table.status',
    flex: 1,
    renderCell: params => <CourierStatus status={params.value} />,
    valueOptions: COURIER_STATUSES,
    sortable: false,
    filterable: true,
    filterOperators: SELECT_OPERATORS,
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
    sortable: true,
    filterable: false,
  },
  [EColumns.RATING]: {
    field: 'rating',
    type: 'number',
    headerName: 'couriers_table.rating',
    width: 100,
    renderCell: params => <Rating rating={params.value} />,
    sortable: true,
    filterable: false,
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

const CouriersTable: ComponentType<IProps> = ({ isProcessing, items, pagination, formValue, onUpdate }) => {
  const { t, i18n } = useTranslation();
  const localeText = useDataGridLabels();

  const outputColumns = useMemo((): GridColDef[] => {
    const statusCol = BASE_COLUMNS[EColumns.STATUS] as GridSingleSelectColDef;

    return [
      BASE_COLUMNS[EColumns.ID],
      BASE_COLUMNS[EColumns.NAME],
      BASE_COLUMNS[EColumns.EMAIL],
      BASE_COLUMNS[EColumns.PHONE],
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

  const handleUpdate = () => {
    if (!onUpdate) {
      return;
    }

    const payload: IFormCouriersFilter = { ...DEFAULT_COURIER_FILTERS };

    const pgMdl = paginationModel.current;

    if (pgMdl) {
      payload.page = (pgMdl.page ?? 0) + 1,
      payload.itemsPerPage = pgMdl.pageSize;
    }

    const fltrMdl = filtersModel.current;

    if (fltrMdl) {
      let nameSearch;
      let emailSearch;
      let phoneSearch;
      let statuses;

      for (let i = 0; i < fltrMdl.items.length; i++) {
        const item = fltrMdl.items[i];

        switch (item.field) {
          case 'name': {
            nameSearch = item.value;
            break;
          }
          case 'email': {
            emailSearch = item.value;
            break;
          }
          case 'phoneNumber': {
            phoneSearch = item.value;
            break;
          }
          case 'status': {
            statuses = item.value;
            break;
          }
        }
      }

      payload.nameSearch = nameSearch;
      payload.emailSearch = emailSearch;
      payload.phoneSearch = phoneSearch;
      payload.statuses = statuses;
    }

    payload.nameSort = null;
    payload.currentOrdersCountSort = null;
    payload.totalOrdersCountSort = null;
    payload.ratingSort = null;

    const sortBy = sortModel.current?.[0];

    if (sortBy?.sort) {
      switch (sortBy.field) {
        case 'name': {
          payload.nameSort = sortBy.sort as ESortDirection;
          break;
        }
        case 'currentOrdersCount': {
          payload.currentOrdersCountSort = sortBy.sort as ESortDirection;
          break;
        }
        case 'totalOrdersCount': {
          payload.totalOrdersCountSort = sortBy.sort as ESortDirection;
          break;
        }
        case 'rating': {
          payload.ratingSort = sortBy.sort as ESortDirection;
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

    if (formValue.nameSearch) {
      items.push({
        field: 'name',
        operator: 'contains',
        value: formValue.nameSearch,
      });
    }

    if (formValue.emailSearch) {
      items.push({
        field: 'email',
        operator: 'contains',
        value: formValue.emailSearch,
      });
    }

    if (formValue.phoneSearch) {
      items.push({
        field: 'phone',
        operator: 'contains',
        value: formValue.phoneSearch,
      });
    }

    if (formValue.statuses) {
      items.push({
        field: 'status',
        operator: 'isAnyOf',
        value: formValue.statuses,
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

    if (formValue?.nameSort) {
      sortModel.push({
        field: 'name',
        sort: formValue.nameSort,
      });
    }

    if (formValue?.currentOrdersCountSort) {
      sortModel.push({
        field: 'currentOrdersCount',
        sort: formValue.currentOrdersCountSort,
      });
    }

    if (formValue?.totalOrdersCountSort) {
      sortModel.push({
        field: 'totalOrdersCount',
        sort: formValue.totalOrdersCountSort,
      });
    }

    if (formValue?.ratingSort) {
      sortModel.push({
        field: 'rating',
        sort: formValue.ratingSort,
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

export default CouriersTable;


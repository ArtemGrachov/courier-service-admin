import { type ComponentType } from 'react';
import { observer } from 'mobx-react-lite';

import { useMapFiltersCtx } from '../providers/map-filters';
import OrderFilterProvider from '~/providers/order-filters';

import MapFilters from '~/components/map-filters/MapFilters';

import type { IFormMapFilters } from '~/types/forms/form-map-filters';

const FilterMediator: ComponentType = observer(() => {
  const { store: mapFiltersStore, handleUpdate } = useMapFiltersCtx();

  const submitHandler = (formValue: IFormMapFilters) => {
    handleUpdate(formValue);
  }

  return (
    <OrderFilterProvider>
      <MapFilters
        formValue={mapFiltersStore.formValue}
        onSubmit={submitHandler}
      />
    </OrderFilterProvider>
  )
});

export default FilterMediator;

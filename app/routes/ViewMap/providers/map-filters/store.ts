import { makeAutoObservable } from 'mobx';

import type { IFormMapFilters } from '~/types/forms/form-map-filters';

interface IMapFiltersStoreData {
  formValue: IFormMapFilters
}

export class MapFiltersStore implements IMapFiltersStoreData {
  public formValue: IFormMapFilters = {
    status: null,
    courierIds: [],
    senderIds: [],
    receiverIds: [],
  }

  constructor(initialData?: IMapFiltersStoreData) {
    if (initialData) {
      Object.assign(this, initialData);
    }

    makeAutoObservable(this);
  }

  public updateFormValue(formValue: IFormMapFilters) {
    this.formValue = formValue;
  }
}

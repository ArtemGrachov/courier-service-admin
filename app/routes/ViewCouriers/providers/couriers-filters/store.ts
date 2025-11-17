import { makeAutoObservable } from 'mobx';

import { DEFAULT_COURIER_FILTERS } from '~/constants/couriers';

import type { IFormCouriersFilter } from '~/types/forms/form-couriers-filter';

interface ICouriersFiltersStoreData {
  formValue: IFormCouriersFilter
}

export class CouriersFiltersStore implements ICouriersFiltersStoreData {
  public formValue: IFormCouriersFilter = DEFAULT_COURIER_FILTERS;

  constructor(initialData?: ICouriersFiltersStoreData) {
    if (initialData) {
      Object.assign(this, initialData);
    }

    makeAutoObservable(this);
  }

  public updateFormValue(formValue: IFormCouriersFilter) {
    this.formValue = formValue;
  }
}

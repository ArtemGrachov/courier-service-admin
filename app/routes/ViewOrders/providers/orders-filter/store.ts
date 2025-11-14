import { makeAutoObservable } from 'mobx';

import { DEFAULT_ORDER_FILTERS } from '../../constants/orders-filter';

import type { IFormOrdersFilter } from '~/types/forms/form-orders-filter';

interface IOrdersFilterStoreData {
  formValue: IFormOrdersFilter
}

export class OrdersFilterStore implements IOrdersFilterStoreData {
  public formValue: IFormOrdersFilter = DEFAULT_ORDER_FILTERS;

  constructor(initialData?: IOrdersFilterStoreData) {
    if (initialData) {
      Object.assign(this, initialData);
    }

    makeAutoObservable(this);
  }

  public updateFormValue(formValue: IFormOrdersFilter) {
    this.formValue = formValue;
  }
}

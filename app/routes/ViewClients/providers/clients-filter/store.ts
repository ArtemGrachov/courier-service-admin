import { makeAutoObservable } from 'mobx';

import { DEFAULT_CLIENT_FILTERS } from '../../constants/clients-filter';

import type { IFormClientsFilter } from '~/types/forms/form-clients-filter';

interface IClientsFilterStoreData {
  formValue: IFormClientsFilter
}

export class ClientsFilterStore implements IClientsFilterStoreData {
  public formValue: IFormClientsFilter = DEFAULT_CLIENT_FILTERS;

  constructor(initialData?: IClientsFilterStoreData) {
    if (initialData) {
      Object.assign(this, initialData);
    }

    makeAutoObservable(this);
  }

  public updateFormValue(formValue: IFormClientsFilter) {
    this.formValue = formValue;
  }
}

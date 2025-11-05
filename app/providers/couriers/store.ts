import { makeAutoObservable } from 'mobx';

import { EStatus } from '~/constants/status';

import type { IGetCouriersResponse } from '~/types/api/couriers';

export interface ICouriersStoreData {
  getStatus: EStatus;
  getError: any;
  data: IGetCouriersResponse | null;
}

export class CouriersStore implements ICouriersStoreData {
  getStatus: EStatus = EStatus.INIT;
  getError: any = null;
  data: IGetCouriersResponse | null = null;

  constructor(initialData?: ICouriersStoreData) {
    if (initialData) {
      Object.assign(this, initialData);
    }

    makeAutoObservable(this);
  }

  public doGetInit() {
    this.getStatus = EStatus.PROCESSING;
  }

  public doGetSuccess(data: IGetCouriersResponse) {
    this.getStatus = EStatus.SUCCESS;
    this.getError = null;
    this.data = data;
  }

  public doGetError(error?: any) {
    this.getStatus = EStatus.ERROR;
    this.getError = error;
  }

  public get isProcessing() {
    return this.getStatus === EStatus.PROCESSING;
  }

  public get isError() {
    return this.getStatus === EStatus.ERROR;
  }
}

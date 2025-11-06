import { makeAutoObservable } from 'mobx';

import { EStatus } from '~/constants/status';

import type { IGetOrderResponse } from '~/types/api/orders';

export interface IOrderStoreData {
  getStatus: EStatus;
  getError: any;
  data: IGetOrderResponse | null;
}

export class OrderStore implements IOrderStoreData {
  getStatus: EStatus = EStatus.INIT;
  getError: any = null;
  data: IGetOrderResponse | null = null;

  constructor(initialData?: IOrderStoreData) {
    if (initialData) {
      Object.assign(this, initialData);
    }

    makeAutoObservable(this);
  }

  public doGetInit() {
    this.getStatus = EStatus.PROCESSING;
  }

  public doGetSuccess(data: IGetOrderResponse) {
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

import { makeAutoObservable } from 'mobx';

import { EStatus } from '~/constants/status';

import type { IGetOrdersResponse } from '~/types/api/orders';

export interface IOrdersStoreData {
  getStatus: EStatus;
  getError: any;
  data: IGetOrdersResponse | null;
}

export class OrdersStore implements IOrdersStoreData {
  getStatus: EStatus = EStatus.INIT;
  getError: any = null;
  data: IGetOrdersResponse | null = null;

  constructor(initialData?: IOrdersStoreData) {
    if (initialData) {
      Object.assign(this, initialData);
    }

    makeAutoObservable(this);
  }

  public doGetInit() {
    this.getStatus = EStatus.PROCESSING;
  }

  public doGetSuccess(data: IGetOrdersResponse) {
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

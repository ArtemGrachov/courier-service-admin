import { makeAutoObservable } from 'mobx';

import { EStatus } from '~/constants/status';

import type { IGetCourierResponse } from '~/types/api/couriers';

export class CourierStore {
  getStatus: EStatus = EStatus.INIT;
  getError: any = null;
  data: IGetCourierResponse | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public doGetInit() {
    this.getStatus = EStatus.PROCESSING;
    this.getError = null;
  }

  public doGetSuccess(data: IGetCourierResponse) {
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

  public get isSuccess(){
    return this.getStatus === EStatus.SUCCESS;
  }
}

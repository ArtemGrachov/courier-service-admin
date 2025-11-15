import { makeAutoObservable } from 'mobx';

import { EStatus } from '~/constants/status';

import type { IGetStatsResponse } from '~/types/api/stats';

export interface IStatsStoreData {
  getStatus: EStatus;
  getError: any;
  data: IGetStatsResponse | null;
}

export class StatsStore implements IStatsStoreData {
  getStatus: EStatus = EStatus.INIT;
  getError: any = null;
  data: IGetStatsResponse | null = null;

  constructor(initialData?: IStatsStoreData) {
    if (initialData) {
      Object.assign(this, initialData);
    }

    makeAutoObservable(this);
  }

  public doGetInit() {
    this.getStatus = EStatus.PROCESSING;
  }

  public doGetSuccess(data: IGetStatsResponse) {
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
